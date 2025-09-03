from flask import Blueprint, request, jsonify
import pandas as pd
import os
from .processing import extractData, calculateBoxes

cartoonCalc = Blueprint("cartoonCalc", __name__)

# Load the static CSV once at startup
CSV_PATH = os.path.join(os.path.dirname(__file__), "test.csv")
pcsperbox_df = pd.read_csv(CSV_PATH)

@cartoonCalc.route("/processFiles", methods=["POST"])
def processFiles():
    """
    POST request with:
      - pdfs (multiple PDF files)
    Returns JSON of results
    """
    if "pdfs" not in request.files:
        print("hmmm")
        return jsonify({"error": "No PDF files uploaded"}), 400

    pdf_files = request.files.getlist("pdfs")
    all_data = []

    for pdf_file in pdf_files:
        try:
            products = extractData(pdf_file, filename=pdf_file.filename)
            all_data.extend(products)
        except Exception as e:
            return jsonify({"error": f"Failed to process {pdf_file.filename}: {e}"}), 500

    if not all_data:
        return jsonify({"error": "No products extracted"}), 400

    results, totalCartoon = calculateBoxes(all_data, pcsperbox_df)
    grouped = {}
    notFound = []
    for item in results:
        grouped.setdefault(item["Source File"], []).append(item)
        if item.get("Boxes Required") == "Not Found":
            notFound.append(item)

    
    return_data = {"grouped": grouped, "totalCartoon": totalCartoon, "notFound": notFound}
    # print(return_data)

    
    
    return jsonify(return_data)
    

