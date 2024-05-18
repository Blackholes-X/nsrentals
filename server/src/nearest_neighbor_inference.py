import os
import pandas as pd
import pickle
from sklearn.neighbors import NearestNeighbors
import os
from src import dbutils as DU

def load_pickled_files():
    os.path.dirname
    # models_dir ="./models/running_model/"
    models_dir = "./models/nearest_neighbour"
    """Loads the pickled NearestNeighbors model, X_sw_prepared."""
    with open(os.path.join(models_dir, 'nearest_neighbors_model.pkl'), 'rb') as f:
        nn = pickle.load(f)
    with open(os.path.join(models_dir, 'X_sw_prepared.pkl'), 'rb') as f:
        X_sw_prepared = pickle.load(f)

    return nn, X_sw_prepared


def find_similar_properties(southwest_id):
    """
    Finds and returns the most similar properties to a given Southwest property ID.
    
    Parameters:
    - southwest_id: The ID of the Southwest property to find similarities for.
    - sw_df: DataFrame containing the original Southwest properties, including IDs.
    - comp_df: DataFrame containing the original competitor properties, including all columns.
    - nn: The loaded NearestNeighbors model.
    - X_sw_prepared: The preprocessed features of the Southwest properties.
    
    Returns:
    - DataFrame containing the most similar properties from comp_df.
    """
    sw_df = DU.read_data_from_sec_southwest_listings()
    comp_df = DU.read_data_from_sec_comp_rental_listings()
    nn, X_sw_prepared = load_pickled_files()
    if southwest_id not in sw_df['id'].values:
        print("Southwest property ID not found.")
        return pd.DataFrame()
    
    # Find the index of the Southwest property using its ID
    sw_property_index = sw_df.index[sw_df['id'] == southwest_id].tolist()[0]
    
    if sw_property_index >= len(X_sw_prepared):
        print("Index out of bounds.")
        return pd.DataFrame()
    
    # Extract the feature vector for the given Southwest property
    sw_property_features = X_sw_prepared[sw_property_index].reshape(1, -1)
    
    # Find the indices of the nearest properties in comp_df
    distances, indices = nn.kneighbors(sw_property_features)
    
    # Return the corresponding properties from the original comp_df with all columns
    return comp_df.iloc[indices[0]]

if __name__ == '__main__':
    similar_properties_df = find_similar_properties(southwest_id = 1)
    print(similar_properties_df)