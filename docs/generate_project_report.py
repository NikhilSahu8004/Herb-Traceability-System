from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.graphics.shapes import Drawing, Line, Polygon, Rect, String
from reportlab.platypus import Image, ListFlowable, ListItem, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


OUTPUT = Path("/Users/nikhulsahu/Documents/Majaor Project/Herb_Traceability_Project_Report.pdf")
SCREENSHOT_HOME = Path("/Users/nikhulsahu/Desktop/Screenshot 2026-04-24 at 12.37.42 AM.png")
SCREENSHOT_PORTALS = Path("/Users/nikhulsahu/Desktop/Screenshot 2026-04-24 at 12.37.46 AM.png")
SCREENSHOT_VERIFY = Path("/Users/nikhulsahu/Desktop/Screenshot 2026-04-24 at 12.37.57 AM.png")
SCREENSHOT_DASHBOARD = Path("/Users/nikhulsahu/Desktop/Screenshot 2026-04-24 at 12.38.16 AM.png")


def bullet_list(items, style, left_indent=18):
    return ListFlowable(
        [ListItem(Paragraph(item, style)) for item in items],
        bulletType="bullet",
        leftIndent=left_indent,
    )


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="TitleLarge",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=28,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#0b2a3a"),
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionTitle",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#0d5b43"),
            spaceBefore=10,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SubTitle",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=15,
            textColor=colors.HexColor("#163b52"),
            spaceBefore=8,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodyJustify",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            alignment=TA_JUSTIFY,
            textColor=colors.HexColor("#222222"),
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SmallCenter",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#444444"),
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="FigureCaption",
            parent=styles["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=9,
            leading=12,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#4c5b63"),
            spaceBefore=4,
            spaceAfter=10,
        )
    )
    return styles


def arrow(drawing, x1, y1, x2, y2):
    drawing.add(Line(x1, y1, x2, y2, strokeColor=colors.HexColor("#0d5b43"), strokeWidth=1.5))
    drawing.add(
        Polygon(
            [x2, y2, x2 - 6, y2 + 4, x2 - 6, y2 - 4],
            fillColor=colors.HexColor("#0d5b43"),
            strokeColor=colors.HexColor("#0d5b43"),
        )
    )


def build_flow_chart():
    drawing = Drawing(430, 140)

    def box(x, y, w, h, title):
        drawing.add(
            Rect(
                x,
                y,
                w,
                h,
                rx=10,
                ry=10,
                fillColor=colors.HexColor("#eef7f1"),
                strokeColor=colors.HexColor("#0d5b43"),
                strokeWidth=1.2,
            )
        )
        drawing.add(
            String(
                x + w / 2,
                y + h / 2 - 4,
                title,
                textAnchor="middle",
                fontName="Helvetica-Bold",
                fontSize=9,
                fillColor=colors.HexColor("#163b52"),
            )
        )

    box(10, 88, 120, 34, "Farmer Batch Creation")
    box(155, 88, 120, 34, "Lab Report Validation")
    box(300, 88, 120, 34, "Manufacturer Update")
    box(82, 20, 120, 34, "QR Verification")
    box(227, 20, 120, 34, "Audit + Analytics")

    arrow(drawing, 130, 105, 155, 105)
    arrow(drawing, 275, 105, 300, 105)
    arrow(drawing, 215, 88, 145, 54)
    arrow(drawing, 335, 88, 285, 54)
    arrow(drawing, 202, 37, 227, 37)
    return drawing


def add_figure(story, path, caption, width, max_height, styles):
    image = Image(str(path))
    image.hAlign = "CENTER"
    image._restrictSize(width, max_height)
    story.append(image)
    story.append(Paragraph(caption, styles["FigureCaption"]))


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(colors.HexColor("#58707d"))
    canvas.drawString(doc.leftMargin, 18, "Herb Traceability System Project Report")
    canvas.drawRightString(A4[0] - doc.rightMargin, 18, f"Page {doc.page}")
    canvas.restoreState()


def build_story(styles):
    story = []
    story.append(Spacer(1, 0.45 * inch))
    story.append(Paragraph("Herb Traceability System", styles["TitleLarge"]))
    story.append(Paragraph("Use Case, Technology Stack, and Full Project Explanation", styles["SmallCenter"]))
    story.append(
        Paragraph(
            "This document explains the complete herbal traceability platform built for farmer registration, laboratory verification, manufacturer processing, and customer-side authenticity checking using QR code, geo-tagging, MongoDB, and a blockchain-ready architecture.",
            styles["BodyJustify"],
        )
    )
    story.append(Spacer(1, 0.15 * inch))

    story.append(Paragraph("1. Project Overview", styles["SectionTitle"]))
    story.append(
        Paragraph(
            "The Herb Traceability System is a full-stack web application designed to create trust and transparency in the Ayurvedic herb supply chain. The platform records harvesting details from the farmer side, adds quality validation from the laboratory side, captures formulation and packaging updates from the manufacturer side, and finally exposes a verification portal for customers. The main goal is to prevent data loss, reduce authenticity disputes, and provide an auditable digital journey for every herb batch.",
            styles["BodyJustify"],
        )
    )
    story.append(
        bullet_list(
            [
                "Create geo-tagged herb batches at the time of collection.",
                "Track quality reports and compliance checkpoints through the laboratory flow.",
                "Record manufacturing actions such as formulation and packaging.",
                "Generate QR-linked traceability records for public verification.",
                "Maintain audit history, analytics, blockchain-ready status, and dashboard summaries.",
            ],
            styles["BodyJustify"],
        )
    )

    story.append(Paragraph("2. Problem Statement", styles["SectionTitle"]))
    story.append(
        Paragraph(
            "Traditional herb supply chains often rely on paper records, disconnected spreadsheets, or informal updates between farmers, laboratories, and manufacturers. This makes it difficult to prove product origin, validate quality claims, and investigate disputes. The project addresses these issues by introducing a structured digital workflow with role-based dashboards and public verification tools.",
            styles["BodyJustify"],
        )
    )

    story.append(Paragraph("3. Main Use Case", styles["SectionTitle"]))
    story.append(
        Paragraph(
            "The primary use case is traceability of Ayurvedic herbs from cultivation or collection through testing, manufacturing, packaging, and customer verification. Every stakeholder can log in to a dedicated portal and update the same batch through different stages of the supply chain.",
            styles["BodyJustify"],
        )
    )
    story.append(Paragraph("Stakeholder Use Cases", styles["SubTitle"]))
    story.append(
        bullet_list(
            [
                "<b>Farmer:</b> registers herbs, adds harvesting and geo-tagging information, sets batch number and compliance status, and creates the first digital traceability record.",
                "<b>Laboratory:</b> selects a product, uploads report information, records pass or fail results, and updates purity and moisture values.",
                "<b>Manufacturer:</b> accepts verified batches, attaches process code and formulation details, and updates packaging or dispatch readiness.",
                "<b>Customer:</b> scans a QR image or enters a batch code to check the full authenticity report including harvest, lab, manufacturing, blockchain, and audit timeline.",
                "<b>Admin or evaluator:</b> can observe analytics, region-wise activity, quality trends, and complete audit logs for review or presentation.",
            ],
            styles["BodyJustify"],
        )
    )

    story.append(Paragraph("4. Functional Workflow", styles["SectionTitle"]))
    story.append(Paragraph("Farmer Flow", styles["SubTitle"]))
    story.append(
        bullet_list(
            [
                "Farmer registers or logs in.",
                "Farmer creates a new batch using herb name, botanical name, batch code, batch number, source type, region, latitude, longitude, harvest date, quantity, and AYUSH status.",
                "System stores the record in MongoDB or the mock fallback store.",
                "QR payload is generated for the batch.",
                "Analytics and map panels update based on the newly created batch.",
            ],
            styles["BodyJustify"],
        )
    )
    story.append(Paragraph("Laboratory Flow", styles["SubTitle"]))
    story.append(
        bullet_list(
            [
                "Lab user logs in through the Laboratory portal.",
                "Lab selects a product or batch from the dashboard.",
                "Lab records report ID, pass or fail result, notes, purity percentage, and moisture percentage.",
                "System stores the report inside the batch, updates quality metrics, changes compliance status, and appends an audit log entry.",
            ],
            styles["BodyJustify"],
        )
    )
    story.append(Paragraph("Manufacturer Flow", styles["SubTitle"]))
    story.append(
        bullet_list(
            [
                "Manufacturer logs in through the manufacturing portal.",
                "Manufacturer selects a verified or ready batch.",
                "Manufacturer records process code, formulation name, packaging status, and manufacturing notes.",
                "System adds processing data, updates blockchain-ready information, and creates a simulated transaction hash.",
            ],
            styles["BodyJustify"],
        )
    )
    story.append(Paragraph("Customer Verification Flow", styles["SubTitle"]))
    story.append(
        bullet_list(
            [
                "Customer opens the verification portal.",
                "Customer uploads a QR image or enters a batch code manually.",
                "System decodes the QR image using browser-native detection when available and falls back to the <b>jsqr</b> library when needed.",
                "The result screen shows harvesting details, lab reports, manufacturing details, blockchain verification, and audit timeline in one place.",
            ],
            styles["BodyJustify"],
        )
    )
    story.append(Paragraph("Process Flow Chart", styles["SubTitle"]))
    story.append(
        Paragraph(
            "The following flow chart summarizes how a herb batch moves through the proposed system from collection to public verification.",
            styles["BodyJustify"],
        )
    )
    story.append(build_flow_chart())
    story.append(Paragraph("Figure 1. Overall workflow of the Herb Traceability System.", styles["FigureCaption"]))

    story.append(Paragraph("Project Interface Snapshots", styles["SubTitle"]))
    story.append(
        Paragraph(
            "The screenshots below present the main user interface screens of the developed application, including the home page, role portals, verification screen, and farmer dashboard.",
            styles["BodyJustify"],
        )
    )
    add_figure(
        story,
        SCREENSHOT_HOME,
        "Figure 2. Herb Portal landing page.",
        6.7 * inch,
        3.2 * inch,
        styles,
    )
    add_figure(
        story,
        SCREENSHOT_PORTALS,
        "Figure 3. Role-based portal access section showing Farmer, Laboratory, Manufacturer, and Customer Verify modules.",
        6.7 * inch,
        3.2 * inch,
        styles,
    )
    story.append(PageBreak())
    add_figure(
        story,
        SCREENSHOT_VERIFY,
        "Figure 4. Customer verification screen for checking a herb batch by QR code or batch number.",
        6.7 * inch,
        3.2 * inch,
        styles,
    )
    add_figure(
        story,
        SCREENSHOT_DASHBOARD,
        "Figure 5. Farmer dashboard with geo-tagged batch creation, analytics, and origin mapping.",
        6.7 * inch,
        3.4 * inch,
        styles,
    )

    story.append(PageBreak())
    story.append(Paragraph("5. Technology Stack", styles["SectionTitle"]))
    tech_table = Table(
        [
            ["Layer", "Technology", "Purpose"],
            ["Frontend", "React + Vite", "Single-page application, role-based dashboards, portal UI, QR verification screens"],
            ["Styling", "Custom CSS", "Dark PDF-inspired portal design and responsive layouts"],
            ["Backend", "Node.js + Express", "API server for auth, batches, dashboards, verification, and role flows"],
            ["Database", "MongoDB + Mongoose", "Stores users, batches, reports, processing data, and traceability history"],
            ["Authentication", "JWT", "Secures role-based login and session handling"],
            ["QR Generation", "qrcode", "Creates QR images for each batch"],
            ["QR Decoding", "jsqr + BarcodeDetector", "Reads uploaded QR images during customer verification"],
            ["Security", "bcryptjs", "Password hashing for user accounts"],
            ["Blockchain-ready Layer", "Simulated ledger / Hardhat scaffold", "Represents future smart contract anchoring and transaction references"],
            ["Optional Services", "Python microservice stubs", "Reserved for geo or analytics extensions in future work"],
        ],
        colWidths=[1.05 * inch, 1.85 * inch, 3.7 * inch],
    )
    tech_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0d5b43")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#c8d2d8")),
                ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f7fafb")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEADING", (0, 0), (-1, -1), 13),
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("PADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(tech_table)

    story.append(Paragraph("6. Project Architecture", styles["SectionTitle"]))
    story.append(
        Paragraph(
            "The repository is organized using a separate frontend and backend structure. The frontend contains components, pages, services, and styling, while the backend contains models, controllers, routes, and services. This makes the project easier to debug, maintain, and scale.",
            styles["BodyJustify"],
        )
    )
    story.append(Paragraph("Architecture Summary", styles["SubTitle"]))
    story.append(
        bullet_list(
            [
                "<b>frontend/src/components</b>: reusable UI units such as Navbar, Footer, MapView, BatchCard, QRScanner, and shared dashboard panels.",
                "<b>frontend/src/pages</b>: role-specific pages for Farmer, Lab, Manufacturer, Home, Dashboard, and Verify.",
                "<b>frontend/src/services</b>: API communication and blockchain helper logic.",
                "<b>backend/models</b>: schemas for User, Batch, LabReport, and Processing.",
                "<b>backend/controllers</b>: request handling for authentication, batches, farmer, lab, and manufacturer flows.",
                "<b>backend/routes</b>: API route mappings.",
                "<b>backend/services</b>: QR generator, auth logic, geo helper, and a mock data store fallback.",
            ],
            styles["BodyJustify"],
        )
    )

    story.append(Paragraph("7. Core Modules Explained", styles["SectionTitle"]))
    story.append(Paragraph("Authentication Module", styles["SubTitle"]))
    story.append(
        Paragraph(
            "Authentication uses JWT-based login with password hashing through bcryptjs. Each user account stores a role such as Farmer, Lab, or Manufacturer. The system supports role-specific login pages and separate registration pages for each portal. Users are routed to the correct dashboard based on the actual role stored for the account.",
            styles["BodyJustify"],
        )
    )
    story.append(Paragraph("Batch Management Module", styles["SubTitle"]))
    story.append(
        Paragraph(
            "The batch controller manages creation, retrieval, update events, QR generation, deletion, and public verification. Each batch stores identifying values like batch code and batch number, harvesting metadata, compliance status, quality metrics, laboratory reports, processing logs, blockchain status, and audit history.",
            styles["BodyJustify"],
        )
    )
    story.append(Paragraph("Analytics Module", styles["SubTitle"]))
    story.append(
        Paragraph(
            "Dashboard analytics compute total batch count, verification rate, average quality, quality bands, and region-wise activity. The analytics are derived from live batch data, so once demo defaults are removed the dashboard reflects only the products entered by actual users.",
            styles["BodyJustify"],
        )
    )
    story.append(Paragraph("Verification Module", styles["SubTitle"]))
    story.append(
        Paragraph(
            "The verification module gives customers a single-screen report showing product origin, testing results, manufacturing status, blockchain notes, and audit trail. This helps convert raw traceability data into a readable authenticity document for buyers or reviewers.",
            styles["BodyJustify"],
        )
    )

    story.append(Paragraph("8. Database Design", styles["SectionTitle"]))
    story.append(
        Paragraph(
            "MongoDB is used as the main database because the project stores nested and evolving traceability information such as events, reports, processing entries, and audit logs. This structure is easier to model as a document than as a rigid relational table-only design.",
            styles["BodyJustify"],
        )
    )
    story.append(
        bullet_list(
            [
                "<b>User:</b> name, email, password hash, role, and optional location details.",
                "<b>Batch:</b> batch code, batch number, herb details, collector, source, geo-tagged origin, quantity, harvest date, quality metrics, compliance, blockchain state, events, lab reports, processing log, and audit log.",
                "<b>LabReport:</b> report ID, purity, moisture, result, notes, and timestamps.",
                "<b>Processing:</b> process code, formulation name, packaging status, notes, and timestamps.",
            ],
            styles["BodyJustify"],
        )
    )

    story.append(PageBreak())
    story.append(Paragraph("9. Key Features Implemented", styles["SectionTitle"]))
    story.append(
        bullet_list(
            [
                "Role-specific login and registration for Farmer, Laboratory, and Manufacturer.",
                "Geo-tagged farmer batch creation with batch code and batch number.",
                "Selectable AYUSH status for new products.",
                "Laboratory report submission for different selected products.",
                "Manufacturer operations with processing and packaging details.",
                "Customer verify page with full traceability explanation.",
                "QR management including preview, open, and download.",
                "QR image upload verification with fallback decoding support.",
                "Search and filters by batch code, batch number, herb name, region, stage, and quality.",
                "Audit log showing who updated what and when.",
                "Analytics for batch totals, verification rate, average quality, and region-wise activity.",
                "Delete product option available across all three role dashboards and report panels.",
            ],
            styles["BodyJustify"],
        )
    )

    story.append(Paragraph("10. Advantages of the Project", styles["SectionTitle"]))
    story.append(
        bullet_list(
            [
                "Improves transparency in the herbal medicine supply chain.",
                "Reduces dependency on manual paper-based tracking.",
                "Makes quality checkpoints visible to all stakeholders.",
                "Allows consumers to verify authenticity independently.",
                "Provides a strong academic major-project demonstration of full-stack engineering, traceability logic, and role-based design.",
            ],
            styles["BodyJustify"],
        )
    )

    story.append(Paragraph("11. Limitations and Current Development Notes", styles["SectionTitle"]))
    story.append(
        bullet_list(
            [
                "Blockchain anchoring is currently simulated rather than connected to a live smart contract.",
                "Some optional Python microservices are still scaffolds for future enhancements.",
                "Mock mode is available for development when MongoDB is unavailable.",
                "Older seeded MongoDB records may remain unless deleted manually, because seed logic can insert default records when the database is empty.",
            ],
            styles["BodyJustify"],
        )
    )

    story.append(Paragraph("12. Future Scope", styles["SectionTitle"]))
    story.append(
        bullet_list(
            [
                "Integrate real blockchain smart contracts using Hardhat and Solidity.",
                "Add document uploads for certificates, farm images, and compliance proofs.",
                "Use map services such as Leaflet or Mapbox for real geospatial visualization.",
                "Introduce predictive analytics or adulteration risk models using Python services.",
                "Add admin-level reporting and export to PDF or CSV from the dashboard.",
                "Extend customer verification with multilingual support and product certification downloads.",
            ],
            styles["BodyJustify"],
        )
    )

    story.append(Paragraph("13. Conclusion", styles["SectionTitle"]))
    story.append(
        Paragraph(
            "The Herb Traceability System is a strong end-to-end digital platform for tracing Ayurvedic herb batches across farmer, laboratory, manufacturer, and customer stages. It demonstrates a practical use of React, Node.js, MongoDB, JWT authentication, QR-based verification, geo-tagging, analytics, audit tracking, and blockchain-ready architecture. As a major project, it combines real-world supply chain relevance with modern full-stack implementation and offers clear scope for future extension.",
            styles["BodyJustify"],
        )
    )

    return story


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    styles = build_styles()
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=42,
        leftMargin=42,
        topMargin=42,
        bottomMargin=34,
        title="Herb Traceability System Project Report",
        author="OpenAI Codex",
    )
    doc.build(build_story(styles), onFirstPage=header_footer, onLaterPages=header_footer)
    print(OUTPUT)


if __name__ == "__main__":
    main()
