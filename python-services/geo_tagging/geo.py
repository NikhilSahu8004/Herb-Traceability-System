def normalize_coordinates(latitude, longitude):
    return {
        "latitude": round(float(latitude), 6),
        "longitude": round(float(longitude), 6),
    }


if __name__ == "__main__":
    print(normalize_coordinates(22.6013, 75.3025))
