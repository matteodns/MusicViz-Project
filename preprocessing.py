import pandas as pd
import os 

def normalize_geogenre(df):
    genre_list = list(df.columns)
    genre_list.remove('Country')
    genre_list.remove('Unnamed: 0')

    df["tot"] = df[genre_list].sum(axis=1)

    for genre in genre_list:
        df[genre] = df[genre]/df["tot"]
    df.drop(columns=["Unnamed: 0", "tot"], inplace=True)

    return df

def save_all_geogenres(df, data_dir):    
    geoHipHop = df[["Country", "Hip hop/Rap/R&b"]].rename(columns={"Hip hop/Rap/R&b": "popularity"})
    geoEDM = df[["Country", "EDM"]].rename(columns={"EDM": "popularity"})
    geoPop = df[["Country", "Pop"]].rename(columns={"Pop": "popularity"})
    geoRock = df[["Country", "Rock/Metal"]].rename(columns={"Rock/Metal": "popularity"})
    geoLatin = df[["Country", "Latin/Reggaeton"]].rename(columns={"Latin/Reggaeton": "popularity"})
    geoOther = df[["Country", "Other"]].rename(columns={"Other": "popularity"})

    geoHipHop.to_csv(os.path.join(data_dir, 'GeoHipHop.csv'), index=False)
    geoEDM.to_csv(os.path.join(data_dir, 'GeoEDM.csv'), index=False)
    geoPop.to_csv(os.path.join(data_dir, 'GeoPop.csv'), index=False)
    geoRock.to_csv(os.path.join(data_dir, 'GeoRock.csv'), index=False)
    geoLatin.to_csv(os.path.join(data_dir, 'GeoLatin.csv'), index=False)
    geoOther.to_csv(os.path.join(data_dir, 'GeoOther.csv'), index=False)


def main():
    cur_dir = os.getcwd()
    data_dir = os.path.join(cur_dir, 'data')
    classichit_file = os.path.join(data_dir, 'ClassicHit_raw.csv')
    geogenre_file = os.path.join(data_dir, 'GeoGenre_raw.csv')

    classichit_df = pd.read_csv(classichit_file)
    geogenre_df = pd.read_csv(geogenre_file)

    # Preprocess geogenre_df
    geogenre_df.drop_duplicates(subset='Country', keep='first', inplace=True)
    geogenre_df = normalize_geogenre(geogenre_df)

    # Save all geogenres
    save_all_geogenres(geogenre_df, data_dir)



if __name__ == "__main__":
    main()
