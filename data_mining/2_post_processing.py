from src.config import *
from src.utils import *
from src.db_utils import *
from src.dp_utils import *



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

    # Initialize utility columns with 0
    for utility in utilities:
        trans_df[f'utility_{utility}'] = 0
    trans_df['parking_availability'] = 0

    trans_df = trans_df.apply(update_utilities_and_parking, axis=1)

    trans_df['monthly_rent'] = trans_df['monthly_rent'].astype(str)
    trans_df['bedroom_count'] = trans_df['bedroom_count'].astype(str)
    trans_df['bathroom_count'] = trans_df['bathroom_count'].astype(str)

    # Convert apartment_size to string if keeping VARCHAR in DB
    trans_df['apartment_size'] = trans_df['apartment_size'].astype(str)

    # print(trans_df.dtypes)
    
    save_df_to_sec_public_rental_data(trans_df)



def public_post_process():

    df_comp_data = read_data_from_comp_rental_listings()
    transform_comp_dataframe_df = transform_comp_dataframe(df_comp_data)

    
    save_df_to_sec_comp_rental_listings(transform_comp_dataframe_df)


    



if __name__ == "__main__":
    general_post_process()
    public_post_process()