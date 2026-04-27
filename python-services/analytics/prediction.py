def predict_quality_score(purity_percent, moisture_percent):
    return round((float(purity_percent) * 0.8) + ((100 - float(moisture_percent)) * 0.2), 2)


if __name__ == "__main__":
    print(predict_quality_score(95, 8))
