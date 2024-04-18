from src.config import *
from src.utils import *
from src.db_utils import *
from src.dp_utils import *
from data_processing import address_utils, parking_utils



# Assuming transform_dataframe returns a DataFrame ready for processing
def general_post_process():
    df_public_rental_data = read_data_from_public_rental_data()
    trans_df = transform_dataframe(df_public_rental_data)

    # Extract and convert monthly_rent to float, fill missing values
    monthly_rent = (trans_df['monthly_rent'].str.extract(r'(\d+,?\d*)')
                                             .replace(',', '', regex=True)
                                             .astype(float))
    trans_df['monthly_rent'] = monthly_rent.fillna(-1)

    # Apply transformations directly without chained indexing
    trans_df['bedroom_count'] = trans_df['bedroom_count'].apply(extract_numeric_value)
    trans_df['bathroom_count'] = trans_df['bathroom_count'].apply(extract_numeric_value)
    trans_df['apartment_size'] = trans_df['apartment_size'].apply(extract_apartment_size)
    trans_df['property_image'] = trans_df['image']

    # Initialize utility columns with 0
    for utility in utilities:
        trans_df[f'utility_{utility}'] = 0
    trans_df['parking_availability'] = 0

    trans_df = trans_df.apply(update_utilities_and_parking, axis=1)

    # # # address data
    # # address_preprocessor = address_utils.AddressPreprocessor()
    # # processed_df = address_preprocessor.get_address_data(trans_df)

    # # # parking data
    # # df_sec_parking_data = read_data_from_sec_parking_data()
    # # parking_preprocessor = parking_utils.ParkingUtils(df_sec_parking_data)
    # # updated_trans_df = parking_preprocessor.update_trans_df_with_nearest_parking(processed_df)
    # # save_df_to_sec_public_rental_data(updated_trans_df)


    save_df_to_sec_public_rental_data(trans_df)



def comp_post_process():

    df_comp_data = read_data_from_comp_rental_listings()
    transform_comp_dataframe_df = transform_comp_dataframe(df_comp_data)

    save_df_to_sec_comp_rental_listings(transform_comp_dataframe_df)


def southwest_post_process():
    df_sw_data = read_southwest_listing_csv(csv_path='data/SouthWestListingStructuredData.csv')
    trans_sw_data = transform_sw_dataframe(df_sw_data)

    save_df_to_southwest_listings(trans_sw_data)


if __name__ == "__main__":
    
    general_post_process()
    
    # comp_post_process()

    # southwest_post_process()