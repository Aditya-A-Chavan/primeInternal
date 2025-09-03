import pandas as pd
import re
import os
import pdfplumber

def extractData(pdf_file, filename="uploaded.pdf"):
    """
    Extract products from a single PDF file object.
    pdf_file: file-like object (BytesIO or Werkzeug FileStorage)
    filename: original file name (for Source File column)
    """
    products = []
    seen_barcodes = set()

    def parse_int(val):
        """Convert string like '1,440' → 1440"""
        return int(val.replace(",", "").strip())

    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            lines = page.extract_text().split('\n')
            for i, line in enumerate(lines):
                if re.match(r"^\d{1,2}\)\s+\d{6,8}", line.strip()):
                    line1 = line.strip()
                    line2 = lines[i + 1].strip() if i + 1 < len(lines) else ''

                    try:
                        tokens = line1.split()
                        barcode = tokens[1]
                        mrp = float(tokens[3].replace(",", ""))

                        qty = 0
                        for t in tokens[5:]:
                            if re.match(r"^\d{1,3}(,\d{3})*$", t) or t.isdigit():
                                qty = parse_int(t)
                                break

                        # Product name extraction
                        name_tokens = []
                        for token in line2.split():
                            if re.match(r"^\d+(\.\d+)?$", token):
                                break
                            name_tokens.append(token)
                        name = " ".join(name_tokens)

                        if barcode not in seen_barcodes:
                            seen_barcodes.add(barcode)
                            products.append({
                                "Barcode": barcode,
                                "Product Name": name,
                                "MRP": mrp,
                                "QTY": qty,
                                "Source File": filename
                            })

                    except Exception as e:
                        print(f"Error parsing line:\n{line1}\n{line2}\n{e}")

    # print(products)

    return products


import math

def calculateBoxes(products, pcsperbox_df):
    """
    Calculate how many boxes are required for each product.
    Uses ceiling division: total boxes = ceil(QTY / Pcs Per Box).
    """
    results = []
    totalCartoon = 0
    # print(pcsperbox_df["Barcode"])
    for p in products:

        # print(p["Barcode"])
        # print(type(p["Barcode"]), type(pcsperbox_df["Barcode"].iloc[0]))

        row = pcsperbox_df[pcsperbox_df["Barcode"] == int(p["Barcode"])]
        # print(row)
        if not row.empty:
            pcs_per_box = int(row.iloc[0]["Pcs Per Box"])
            qty = int(p["QTY"])

            boxes_required = math.ceil(qty / pcs_per_box)

            p["Boxes Required"] = str(boxes_required)
            totalCartoon += boxes_required
        else:
            p["Boxes Required"] = "Not Found"

        results.append(p)

    # print(results, totalCartoon)

    return results, totalCartoon

