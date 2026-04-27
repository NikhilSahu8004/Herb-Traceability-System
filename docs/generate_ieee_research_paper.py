from pathlib import Path

from reportlab.graphics.shapes import Drawing, Line, Polygon, Rect, String
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    FrameBreak,
    Image,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT = Path("/Users/nikhulsahu/Documents/Majaor Project/Herb_Traceability_IEEE_Research_Paper.pdf")
ASSETS_DIR = Path("/Users/nikhulsahu/Documents/Majaor Project/docs/assets")
SCREENSHOT_HOME = ASSETS_DIR / "home_page.png"
SCREENSHOT_PORTALS = ASSETS_DIR / "portal_modules.png"
SCREENSHOT_VERIFY = ASSETS_DIR / "customer_verify.png"
SCREENSHOT_DASHBOARD = ASSETS_DIR / "farmer_dashboard.png"


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="ConfHeader",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            alignment=TA_CENTER,
            textColor=colors.black,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="PaperTitle",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=18,
            alignment=TA_CENTER,
            textColor=colors.black,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="AuthorText",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=10.5,
            alignment=TA_CENTER,
            textColor=colors.black,
        )
    )
    styles.add(
        ParagraphStyle(
            name="IEEEBody",
            parent=styles["BodyText"],
            fontName="Times-Roman",
            fontSize=9,
            leading=10.8,
            alignment=TA_JUSTIFY,
            textColor=colors.black,
            spaceAfter=5,
        )
    )
    styles.add(
        ParagraphStyle(
            name="IEEESection",
            parent=styles["Heading1"],
            fontName="Times-Bold",
            fontSize=10,
            leading=12,
            alignment=TA_CENTER,
            textColor=colors.black,
            spaceBefore=6,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="FigureCaption",
            parent=styles["BodyText"],
            fontName="Times-Italic",
            fontSize=8,
            leading=9,
            alignment=TA_CENTER,
            textColor=colors.black,
            spaceBefore=2,
            spaceAfter=5,
        )
    )
    styles.add(
        ParagraphStyle(
            name="RefText",
            parent=styles["BodyText"],
            fontName="Times-Roman",
            fontSize=8.5,
            leading=10,
            alignment=TA_LEFT,
            leftIndent=12,
            firstLineIndent=-12,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="TableText",
            parent=styles["BodyText"],
            fontName="Times-Roman",
            fontSize=8,
            leading=9.2,
            alignment=TA_LEFT,
            textColor=colors.black,
        )
    )
    return styles


def on_page(canvas, doc):
    return None


def build_doc():
    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        leftMargin=40,
        rightMargin=40,
        topMargin=34,
        bottomMargin=34,
        title="Herb Traceability IEEE Research Paper",
        author="Nikhil Sahu",
    )

    page_width, page_height = letter
    gap = 14
    usable_width = page_width - doc.leftMargin - doc.rightMargin
    col_width = (usable_width - gap) / 2

    first_top = Frame(
        doc.leftMargin,
        page_height - doc.topMargin - 1.55 * inch,
        usable_width,
        1.55 * inch,
        id="first_top",
        showBoundary=0,
    )
    first_left = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        col_width,
        page_height - doc.bottomMargin - doc.topMargin - 1.7 * inch,
        id="first_left",
        showBoundary=0,
    )
    first_right = Frame(
        doc.leftMargin + col_width + gap,
        doc.bottomMargin,
        col_width,
        page_height - doc.bottomMargin - doc.topMargin - 1.7 * inch,
        id="first_right",
        showBoundary=0,
    )
    later_left = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        col_width,
        page_height - doc.bottomMargin - doc.topMargin,
        id="later_left",
        showBoundary=0,
    )
    later_right = Frame(
        doc.leftMargin + col_width + gap,
        doc.bottomMargin,
        col_width,
        page_height - doc.bottomMargin - doc.topMargin,
        id="later_right",
        showBoundary=0,
    )
    full_width = Frame(
        doc.leftMargin,
        doc.bottomMargin,
        usable_width,
        page_height - doc.bottomMargin - doc.topMargin,
        id="full_width",
        showBoundary=0,
    )

    doc.addPageTemplates(
        [
            PageTemplate(id="First", frames=[first_top, first_left, first_right], onPage=on_page),
            PageTemplate(id="Later", frames=[later_left, later_right], onPage=on_page),
            PageTemplate(id="Figures", frames=[full_width], onPage=on_page),
        ]
    )
    return doc


def bullet_list(items, style):
    return ListFlowable(
        [ListItem(Paragraph(item, style)) for item in items],
        bulletType="bullet",
        leftIndent=16,
    )


def add_paragraphs(story, items, style):
    for item in items:
        story.append(Paragraph(item, style))


def add_arrow(drawing, x1, y1, x2, y2):
    drawing.add(Line(x1, y1, x2, y2, strokeColor=colors.HexColor("#274f3d"), strokeWidth=1.4))
    drawing.add(
        Polygon(
            [x2, y2, x2 - 5, y2 + 3, x2 - 5, y2 - 3],
            fillColor=colors.HexColor("#274f3d"),
            strokeColor=colors.HexColor("#274f3d"),
        )
    )


def build_flowchart():
    drawing = Drawing(470, 150)

    def box(x, y, w, h, title):
        drawing.add(
            Rect(
                x,
                y,
                w,
                h,
                rx=8,
                ry=8,
                fillColor=colors.HexColor("#eef6f0"),
                strokeColor=colors.HexColor("#274f3d"),
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
                fontSize=8.5,
                fillColor=colors.HexColor("#163b52"),
            )
        )

    box(10, 96, 135, 30, "Farmer Registration & Harvest")
    box(170, 96, 135, 30, "Lab Testing & Validation")
    box(330, 96, 130, 30, "Manufacturer Processing")
    box(90, 28, 135, 30, "QR/Batch Verification")
    box(250, 28, 135, 30, "Audit Log & Analytics")

    add_arrow(drawing, 145, 111, 170, 111)
    add_arrow(drawing, 305, 111, 330, 111)
    add_arrow(drawing, 238, 96, 160, 58)
    add_arrow(drawing, 360, 96, 318, 58)
    add_arrow(drawing, 225, 43, 250, 43)
    return drawing


def add_figure(story, path, caption, styles, width=3.15 * inch, max_height=2.2 * inch):
    image = Image(str(path))
    image.hAlign = "CENTER"
    image._restrictSize(width, max_height)
    story.append(KeepTogether([image, Spacer(1, 0.04 * inch), Paragraph(caption, styles["FigureCaption"])]))


def add_table(story, rows, col_widths, styles, caption):
    table = Table(rows, colWidths=col_widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e6efe9")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.black),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Times-Roman"),
                ("FONTSIZE", (0, 0), (-1, -1), 7.8),
                ("LEADING", (0, 0), (-1, -1), 9),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#6b7d73")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    story.append(KeepTogether([table, Spacer(1, 0.04 * inch), Paragraph(caption, styles["FigureCaption"])]))


def story():
    styles = build_styles()
    story = []

    story.append(
        Paragraph(
            "Blockchain-Enabled Herbal Traceability System Using Geo-Tagging, QR Code Verification, and Role-Based Supply Chain Management",
            styles["PaperTitle"],
        )
    )

    author_table = Table(
        [
            [
                Paragraph(
                    "<b>Nikhil Sahu</b><br/>School of Information Science<br/>Presidency University<br/>Bengaluru, India<br/>nikhilsahu8004@gmail.com",
                    styles["AuthorText"],
                ),
                Paragraph(
                    "<b>Dr. Devi S</b><br/>Presidency School of Information Science<br/>Presidency University<br/>Bengaluru, India<br/>devi.s@presidencyuniversity.in",
                    styles["AuthorText"],
                ),
            ]
        ],
        colWidths=[3.0 * inch, 3.0 * inch],
    )
    author_table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    story.append(author_table)
    story.append(Spacer(1, 0.06 * inch))
    story.append(FrameBreak())

    story.append(
        Paragraph(
            "<b>Abstract—</b> Traceability in Ayurvedic herb supply chains is often weakened by fragmented documentation, manual coordination across stakeholders, and the absence of a unified verification mechanism for end users. This paper presents a blockchain-enabled herbal traceability platform that integrates farmer-side geo-tagged batch creation, laboratory quality validation, manufacturer-side processing updates, and customer verification through QR code or batch number lookup. The system is implemented as a full-stack web platform using React, Node.js, Express, MongoDB, JWT-based authentication, QR generation, and browser-compatible QR decoding support. Each herb batch stores harvesting origin, batch identifiers, compliance state, quality metrics, process logs, blockchain-ready metadata, and audit history. A customer-facing verification page consolidates all stages into a single transparency report. The proposed platform demonstrates how modern web engineering can provide trustworthy, auditable, and scalable traceability for herbal ecosystems while also preparing the architecture for future smart contract anchoring and advanced analytics.",
            styles["IEEEBody"],
        )
    )
    story.append(
        Paragraph(
            "<b>Keywords—</b> Herb Traceability, Ayurvedic Supply Chain, Geo-Tagging, QR Code Verification, Blockchain, MongoDB, React, Audit Log, Supply Chain Transparency.",
            styles["IEEEBody"],
        )
    )

    story.append(Paragraph("I. INTRODUCTION", styles["IEEESection"]))
    add_paragraphs(
        story,
        [
            "Herbal and Ayurvedic products move through a multi-stage ecosystem that includes cultivation or collection, laboratory testing, processing, packaging, and final consumer purchase. In many real-world settings, these stages are documented independently, resulting in fragmented records and low confidence in product authenticity. This problem becomes especially significant when consumers, regulators, and manufacturers need proof of product origin, compliance, and testing status.",
            "A unified digital traceability system can reduce these gaps by maintaining a continuous product identity across the supply chain. If each batch receives a persistent digital record from the moment it is harvested, later stakeholders can enrich that record instead of recreating disconnected reports. This makes auditing easier, improves operational clarity, and creates a more transparent customer experience.",
            "The present work introduces a herb traceability platform that links farmers, laboratories, manufacturers, and customers through one web-based system. The design combines geo-tagging, QR-based verification, audit logging, analytics, and blockchain-ready metadata into a practical full-stack implementation focused on transparency and usability.",
        ],
        styles["IEEEBody"],
    )

    story.append(Paragraph("II. RELATED WORK", styles["IEEESection"]))
    add_paragraphs(
        story,
        [
            "Existing research in supply-chain digitization has shown that blockchain, QR-coded product identities, and event-driven audit trails can significantly improve traceability and accountability. Food and agriculture studies frequently report that end-to-end digital records reduce ambiguity and support faster product verification. Similar ideas can be adapted to the herbal sector, where proof of source and quality is equally important.",
            "Studies in blockchain-enabled logistics emphasize the role of immutable checkpoints in preventing data tampering and improving cross-organization trust. At the same time, modern web applications have demonstrated that role-specific dashboards help different stakeholders interact with the same product lifecycle without overloading them with irrelevant functions.",
            "This paper extends these ideas into the Ayurvedic herb domain by integrating geo-tagged batch creation, report-based laboratory updates, manufacturer-side process tracking, and customer-side QR verification in one application. The contribution lies not only in the individual modules, but also in their coordinated workflow within a practical software architecture.",
        ],
        styles["IEEEBody"],
    )

    story.append(Paragraph("III. PROPOSED METHOD", styles["IEEESection"]))
    add_paragraphs(
        story,
        [
            "The proposed method follows a lifecycle-oriented traceability model. The farmer begins the process by creating a batch with herb name, botanical name, batch code, batch number, harvest date, quantity, source type, and geo-tagged coordinates. This initial step creates the base digital identity for the product and associates it with its origin region.",
            "The laboratory stage attaches quality evidence to the same batch. A laboratory user selects a batch and records report ID, quality result, purity percentage, moisture percentage, and notes. This updates quality metrics, compliance state, and audit history. The manufacturer stage records process code, formulation name, packaging status, and manufacturing remarks, creating downstream continuity from testing to production.",
            "The verification stage makes the traceability record accessible to external users. A customer can scan a QR code image or enter a batch code manually. The system returns a consolidated report containing harvesting details, laboratory data, manufacturing logs, blockchain-ready status, and the audit trail. This ensures that public verification is based on the same underlying supply-chain record used by internal stakeholders.",
        ],
        styles["IEEEBody"],
    )
    story.append(Paragraph("<b>Workflow Summary:</b>", styles["IEEEBody"]))
    story.append(
        bullet_list(
            [
                "Farmer creates a geo-tagged batch record.",
                "Laboratory validates purity and compliance information.",
                "Manufacturer records processing and packaging updates.",
                "System generates QR-linked traceability data.",
                "Customer verifies authenticity through a dedicated portal.",
            ],
            styles["IEEEBody"],
        )
    )

    add_figure(
        story,
        SCREENSHOT_HOME,
        "Fig. 1. Landing page of the herb traceability platform.",
        styles,
        max_height=1.75 * inch,
    )

    story.append(Paragraph("IV. SYSTEM IMPLEMENTATION", styles["IEEESection"]))
    add_paragraphs(
        story,
        [
            "The platform is implemented with a React-based frontend and an Express-based backend. MongoDB is used as the primary data store because nested document models are well suited for events, lab reports, manufacturing logs, and audit histories. User authentication is secured using JWT and password hashing. The backend also supports mock mode for cases where a live database is temporarily unavailable during development or demonstration.",
            "The frontend contains role-specific pages for Farmer, Laboratory, Manufacturer, and Customer Verification. Shared components such as Navbar, MapView, QR management, analytics cards, and batch cards make the interface consistent across modules. The customer verification screen was specifically designed to show the full traceability story instead of only a short authenticity message.",
            "QR images are generated using the qrcode library, while QR uploads are decoded with a browser-native detector when supported and a JavaScript fallback when not supported. This improves practical reliability across different browsers and devices.",
            "The batch data model acts as the integration backbone of the system. Each record stores identity attributes such as herb name, botanical name, batch code, quantity, and harvest date, while nested objects preserve origin coordinates, quality metrics, compliance state, blockchain anchor metadata, event history, laboratory reports, manufacturing logs, and audit actions. This schema design reduces duplication and allows all stakeholders to interact with the same evolving traceability object.",
        ],
        styles["IEEEBody"],
    )
    add_table(
        story,
        [
            [
                Paragraph("Module", styles["TableText"]),
                Paragraph("Core Functions", styles["TableText"]),
            ],
            [
                Paragraph("Farmer", styles["TableText"]),
                Paragraph("Batch registration, herb identity capture, harvest date entry, quantity updates, and geo-tagged origin submission.", styles["TableText"]),
            ],
            [
                Paragraph("Laboratory", styles["TableText"]),
                Paragraph("Purity and moisture analysis, result classification, report logging, and compliance-oriented notes.", styles["TableText"]),
            ],
            [
                Paragraph("Manufacturer", styles["TableText"]),
                Paragraph("Process code registration, formulation tracking, packaging status updates, and downstream handling remarks.", styles["TableText"]),
            ],
            [
                Paragraph("Customer Verify", styles["TableText"]),
                Paragraph("Public lookup by batch code or QR image with a consolidated report of the full traceability history.", styles["TableText"]),
            ],
        ],
        [0.9 * inch, 2.1 * inch],
        styles,
        "Table I. Functional summary of the role-based modules implemented in the herb traceability platform.",
    )
    add_figure(
        story,
        SCREENSHOT_PORTALS,
        "Fig. 2. Role-based access modules for farmer, laboratory, manufacturer, and customer users.",
        styles,
        max_height=1.95 * inch,
    )

    story.append(Paragraph("V. RESULTS AND DISCUSSION", styles["IEEESection"]))
    add_paragraphs(
        story,
        [
            "The implemented system supports the complete traceability workflow expected for a herb supply-chain application. Functional validation confirms that farmers can create geo-tagged products, laboratories can submit quality reports for different products, manufacturers can attach process details, and customers can verify the final record using QR images or batch identifiers.",
            "A key strength of the system is the batch-centered data model. Because every stage writes to the same traceability record, the final verification page can present a coherent and readable report without relying on disconnected modules or duplicate entries. Dashboard analytics also provide insight into verification rate, average quality, and region-wise activity for administrators or evaluators.",
            "The current blockchain layer is simulated rather than fully deployed to a live distributed network. However, the inclusion of anchor status, transaction hash fields, and blockchain notes provides a practical bridge toward future smart-contract integration. The architecture is therefore suitable both as a present working application and as a foundation for deeper research extensions.",
            "From an engineering perspective, the design offers strong extensibility because the backend schema already separates event logs, lab report objects, processing records, compliance metadata, and analytics indicators. This modular structure allows future research to introduce predictive quality assessment, regulatory certificate workflows, and live ledger anchoring without redesigning the full application stack.",
        ],
        styles["IEEEBody"],
    )
    add_table(
        story,
        [
            [
                Paragraph("Traceability Attribute", styles["TableText"]),
                Paragraph("Purpose in Verification", styles["TableText"]),
            ],
            [
                Paragraph("Origin Geo-Coordinates", styles["TableText"]),
                Paragraph("Connect the herb batch to a physical source region and strengthen provenance claims.", styles["TableText"]),
            ],
            [
                Paragraph("Quality Metrics", styles["TableText"]),
                Paragraph("Store purity, moisture, and overall quality indicators needed for testing transparency.", styles["TableText"]),
            ],
            [
                Paragraph("Compliance Status", styles["TableText"]),
                Paragraph("Expose certificate readiness and approval state to internal users and evaluators.", styles["TableText"]),
            ],
            [
                Paragraph("Blockchain Metadata", styles["TableText"]),
                Paragraph("Preserve network, anchor status, transaction hash, and notes for future immutable recording.", styles["TableText"]),
            ],
            [
                Paragraph("Audit Log", styles["TableText"]),
                Paragraph("Maintain accountable histories of who updated the record, when, and with what summary.", styles["TableText"]),
            ],
        ],
        [1.1 * inch, 1.9 * inch],
        styles,
        "Table II. Major data attributes that contribute to trustworthy batch verification and auditability.",
    )
    add_figure(
        story,
        SCREENSHOT_VERIFY,
        "Fig. 3. Customer verification interface used to validate a batch through QR or batch number lookup.",
        styles,
        max_height=2.0 * inch,
    )
    add_figure(
        story,
        SCREENSHOT_DASHBOARD,
        "Fig. 4. Farmer dashboard showing geo-tagged batch creation and traceability analytics.",
        styles,
        max_height=2.0 * inch,
    )

    story.append(Paragraph("VI. SYSTEM WORKFLOW", styles["IEEESection"]))
    story.append(
        Paragraph(
            "Figure 5 summarizes the end-to-end information flow from cultivation to customer verification and analytics.",
            styles["IEEEBody"],
        )
    )
    story.append(KeepTogether([build_flowchart(), Paragraph("Fig. 5. End-to-end workflow of the proposed herb traceability system.", styles["FigureCaption"])]))

    story.append(Paragraph("VII. RESEARCH IMPLICATIONS", styles["IEEESection"]))
    add_paragraphs(
        story,
        [
            "The proposed platform demonstrates how software-centric traceability can support both supply-chain operations and academic exploration in the herbal domain. For practitioners, the system offers a practical method to reduce ambiguity in source identification, testing evidence, and processing history. For researchers, it provides a structured implementation baseline that can be extended toward blockchain anchoring, anomaly detection, and certification automation.",
            "Another important implication is that traceability should not be treated as a final-stage verification tool alone. By integrating farmer, laboratory, manufacturer, and customer interactions around a shared batch object, the platform shows that transparency is most effective when it is built continuously across the lifecycle rather than reconstructed after packaging.",
        ],
        styles["IEEEBody"],
    )

    story.append(Paragraph("VIII. CONCLUSION", styles["IEEESection"]))
    add_paragraphs(
        story,
        [
            "This paper presented a full-stack herb traceability platform designed to improve transparency in the Ayurvedic product lifecycle. By connecting farmers, laboratories, manufacturers, and customers through one batch-centric architecture, the system provides a practical model for trustworthy and auditable supply-chain tracking.",
            "The integration of geo-tagging, QR verification, role-based dashboards, analytics, and audit history demonstrates that a modern web platform can address both operational and trust-related challenges in herbal ecosystems. Future work can extend this research by integrating live blockchain smart contracts, richer regulatory documentation, predictive analytics, and large-scale deployment testing.",
        ],
        styles["IEEEBody"],
    )

    story.append(Paragraph("REFERENCES", styles["IEEESection"]))
    refs = [
        "[1] N. Kshetri, “Blockchain’s roles in meeting key supply chain management objectives,” <i>International Journal of Information Management</i>, vol. 39, pp. 80–89, 2018.",
        "[2] M. Saberi, M. Kouhizadeh, J. Sarkis, and L. Shen, “Blockchain technology and its relationships to sustainable supply chain management,” <i>International Journal of Production Research</i>, vol. 57, no. 7, pp. 2117–2135, 2019.",
        "[3] M. Casino, T. K. Dasaklis, and C. Patsakis, “A systematic literature review of blockchain-based applications: Current status, classification and open issues,” <i>Telematics and Informatics</i>, vol. 36, pp. 55–81, 2019.",
        "[4] Y. Lu, “Blockchain: A survey on functions, applications and open issues,” <i>Journal of Industrial Integration and Management</i>, vol. 3, no. 4, 2018.",
        "[5] MongoDB Inc., “MongoDB documentation,” 2026. [Online]. Available: https://www.mongodb.com/docs/",
        "[6] React Team, “React documentation,” 2026. [Online]. Available: https://react.dev/",
        "[7] OpenJS Foundation, “Node.js documentation,” 2026. [Online]. Available: https://nodejs.org/",
        "[8] GS1, <i>GS1 General Specifications</i>, Release 24.0, Brussels, Belgium, 2024.",
    ]
    for ref in refs:
        story.append(Paragraph(ref, styles["RefText"]))

    return story


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = build_doc()
    doc.build(story())
    print(OUTPUT)


if __name__ == "__main__":
    main()
