"""High-fidelity DOCX export for PM Surya Ghar checklist (A4, table-based layout)."""

from __future__ import annotations

import pathlib

from docx import Document
from docx.enum.table import WD_ALIGN_VERTICAL, WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor


LOGO_PATH = pathlib.Path(__file__).resolve().parents[1] / "assets" / "images" / "logo" / "logo.png"

GREEN = RGBColor(0x18, 0xB8, 0x5C)
GREEN_BRIGHT = RGBColor(0x4A, 0xDE, 0x80)
INK = RGBColor(0x17, 0x22, 0x19)
MUTED = RGBColor(0x5B, 0x64, 0x5C)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT = RGBColor(0xDD, 0xEE, 0xDD)


def _shade(cell, fill: str) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    shd.set(qn("w:val"), "clear")
    tc_pr.append(shd)


def _margins(cell, top=60, bottom=60, left=100, right=100) -> None:
    tc_pr = cell._tc.get_or_add_tcPr()
    mar = OxmlElement("w:tcMar")
    for edge, val in (("top", top), ("bottom", bottom), ("left", left), ("right", right)):
        node = OxmlElement(f"w:{edge}")
        node.set(qn("w:w"), str(val))
        node.set(qn("w:type"), "dxa")
        mar.append(node)
    tc_pr.append(mar)


def _no_borders(table) -> None:
    tbl = table._tbl
    tbl_pr = tbl.tblPr
    borders = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        element = OxmlElement(f"w:{edge}")
        element.set(qn("w:val"), "nil")
        borders.append(element)
    tbl_pr.append(borders)


def _set_table_width(table, width_cm: float) -> None:
    table.autofit = False
    table.allow_autofit = False
    table.alignment = WD_TABLE_ALIGNMENT.LEFT
    tbl = table._tbl
    tbl_pr = tbl.tblPr
    tbl_w = OxmlElement("w:tblW")
    tbl_w.set(qn("w:type"), "dxa")
    tbl_w.set(qn("w:w"), str(int(width_cm * 567)))
    tbl_pr.append(tbl_w)


def _run(paragraph, text: str, *, bold=False, size=10, color=None, font="Calibri"):
    run = paragraph.add_run(text)
    run.bold = bold
    run.font.name = font
    run.font.size = Pt(size)
    if color:
        run.font.color.rgb = color
    return run


def _para_space(paragraph, before=0, after=0, align=None):
    paragraph.paragraph_format.space_before = Pt(before)
    paragraph.paragraph_format.space_after = Pt(after)
    if align is not None:
        paragraph.alignment = align


def _checkbox_block(doc, items: list[str], width_cm: float) -> None:
    table = doc.add_table(rows=len(items), cols=2)
    _set_table_width(table, width_cm)
    _no_borders(table)
    for i, item in enumerate(items):
        c0, c1 = table.rows[i].cells
        c0.width = Cm(0.55)
        c1.width = Cm(width_cm - 0.55)
        _margins(c0, top=0, bottom=40, left=0, right=40)
        _margins(c1, top=0, bottom=40, left=0, right=0)
        p0 = c0.paragraphs[0]
        _para_space(p0, after=0)
        _run(p0, "☐", size=10, color=RGBColor(0x8F, 0xA8, 0x97))
        p1 = c1.paragraphs[0]
        _para_space(p1, after=0)
        _run(p1, item, size=9.5)


def _section_title(doc, text: str) -> None:
    p = doc.add_paragraph()
    _para_space(p, before=8, after=4)
    p.paragraph_format.left_indent = Cm(0.15)
    p_pr = p._p.get_or_add_pPr()
    p_bdr = OxmlElement("w:pBdr")
    left = OxmlElement("w:left")
    left.set(qn("w:val"), "single")
    left.set(qn("w:sz"), "16")
    left.set(qn("w:space"), "4")
    left.set(qn("w:color"), "18B85C")
    p_bdr.append(left)
    p_pr.append(p_bdr)
    _run(p, text.upper(), bold=True, size=10, color=INK)


def _panel(doc, title: str, body_builder, width_cm: float):
    table = doc.add_table(rows=2, cols=1)
    _set_table_width(table, width_cm)
    _no_borders(table)
    head, body = table.rows[0].cells[0], table.rows[1].cells[0]
    _shade(head, "172219")
    _shade(body, "F4FAF6")
    _margins(head, top=50, bottom=50, left=90, right=90)
    _margins(body, top=70, bottom=80, left=90, right=90)
    hp = head.paragraphs[0]
    _para_space(hp, after=0)
    _run(hp, title.upper(), bold=True, size=8, color=WHITE, font="Calibri")
    body_builder(body)


def _header(doc, subtitle: str, right_builder, content_cm: float) -> None:
    table = doc.add_table(rows=1, cols=2)
    _set_table_width(table, content_cm)
    _no_borders(table)
    left, right = table.rows[0].cells
    left.width = Cm(content_cm * 0.58)
    right.width = Cm(content_cm * 0.42)
    _shade(left, "172219")
    _shade(right, "172219")
    _margins(left, top=90, bottom=90, left=110, right=70)
    _margins(right, top=90, bottom=90, left=70, right=110)
    left.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    right.vertical_alignment = WD_ALIGN_VERTICAL.TOP

    brand = left.add_table(rows=1, cols=2)
    _no_borders(brand)
    logo_cell, text_cell = brand.rows[0].cells
    logo_cell.width = Cm(1.55)
    text_cell.width = Cm(content_cm * 0.58 - 1.55)
    _margins(logo_cell, 0, 0, 0, 60)
    if LOGO_PATH.exists():
        logo_cell.paragraphs[0].add_run().add_picture(str(LOGO_PATH), width=Cm(1.35))
    tp = text_cell.paragraphs[0]
    _para_space(tp, after=0)
    _run(tp, "FGE Solar", bold=True, size=17, color=WHITE, font="Georgia")
    sp = text_cell.add_paragraph()
    _para_space(sp, after=0)
    _run(sp, subtitle.upper(), size=7.5, color=RGBColor(0xB8, 0xD4, 0xBC))

    right_builder(right)


def build_checklist_docx(docx_path: pathlib.Path) -> None:
    doc = Document()
    sec = doc.sections[0]
    sec.page_height = Cm(29.7)
    sec.page_width = Cm(21.0)
    sec.top_margin = Cm(1.2)
    sec.bottom_margin = Cm(1.0)
    sec.left_margin = Cm(1.4)
    sec.right_margin = Cm(1.4)
    content_w = 18.6

    normal = doc.styles["Normal"]
    normal.font.name = "Calibri"
    normal.font.size = Pt(10)

    def contact_right(cell) -> None:
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        _run(p, "EXPERT CONSULTATION\n", bold=True, size=8, color=GREEN_BRIGHT)
        _run(p, "MNRE empanelled · Kerala-wide\n", size=9, color=LIGHT)
        _run(p, "+91 80890 73029\n", bold=True, size=14, color=WHITE)
        _run(p, "info@fgesolar.in", size=9, color=LIGHT)

    def fields_right(cell) -> None:
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for line in (
            "Applicant name: ________________________________",
            "KSEB consumer no.: _____________________________",
            "District: _______________________________________",
        ):
            lp = cell.add_paragraph() if line != "Applicant name: ________________________________" else p
            _run(lp, line, size=9, color=LIGHT)

    # Page 1
    _header(doc, "Future Green Energy Group", contact_right, content_w)

    p = doc.add_paragraph()
    _para_space(p, before=4, after=2)
    _run(p, "OFFICIAL 2026 HOMEOWNER CHECKLIST", bold=True, size=8, color=GREEN)

    p = doc.add_paragraph()
    _para_space(p, after=4)
    _run(p, "PM Surya Ghar Application Checklist for Kerala", bold=True, size=20, color=INK, font="Georgia")

    p = doc.add_paragraph()
    _para_space(p, after=8)
    _run(
        p,
        "Use this printable checklist before registering on the National Portal. FGE Solar — MNRE empanelled across all 14 Kerala districts — can handle your eligibility check, portal registration, installation, and KSEB net metering.",
        size=10,
        color=MUTED,
    )

    def cfa_body(cell):
        t = cell.add_table(rows=4, cols=2)
        t.style = "Table Grid"
        for i, h in enumerate(("System size", "CFA amount")):
            hc = t.rows[0].cells[i]
            _shade(hc, "233026")
            hp = hc.paragraphs[0]
            _run(hp, h, bold=True, size=8, color=WHITE)
        for r, (a, b) in enumerate(
            [("1 kW", "₹30,000"), ("2 kW", "₹60,000"), ("3 kW and above", "₹78,000 maximum")],
            start=1,
        ):
            t.rows[r].cells[0].paragraphs[0].add_run(a).font.size = Pt(9)
            t.rows[r].cells[1].paragraphs[0].add_run(b).font.size = Pt(9)
        np = cell.add_paragraph()
        _para_space(np, before=4, after=0)
        _run(
            np,
            "Current CFA guideline: ₹30,000/kW for first 2 kW + ₹18,000 for the additional third kW, capped at ₹78,000. Subsidy scheme rates are revised periodically — confirm the latest CFA on the National Portal before applying.",
            size=8,
            color=MUTED,
        )

    grid = doc.add_table(rows=1, cols=2)
    _set_table_width(grid, content_w)
    _no_borders(grid)
    half = content_w / 2 - 0.15
    cfa_cell, elig_cell = grid.rows[0].cells
    cfa_cell.width = Cm(half)
    elig_cell.width = Cm(half)
    _margins(cfa_cell, top=0, bottom=0, left=0, right=80)
    _margins(elig_cell, top=0, bottom=0, left=80, right=0)
    _shade(cfa_cell, "F4FAF6")
    _shade(elig_cell, "F4FAF6")

    hp = cfa_cell.paragraphs[0]
    _run(hp, "CENTRAL FINANCIAL ASSISTANCE (RESIDENTIAL)", bold=True, size=8, color=INK)
    cfa_body(cfa_cell)

    _run(elig_cell.paragraphs[0], "QUICK ELIGIBILITY SELF-CHECK", bold=True, size=8, color=INK)
    elig_items = [
        "Indian citizen with valid KSEB electricity connection in your name",
        "Residential consumer applying for PM Surya Ghar rooftop subsidy",
        "Have not already received PM Surya Ghar subsidy on this KSEB consumer number (one-time per connection)",
        "Installing through an MNRE-empanelled vendor (e.g. FGE Solar)",
        "ALMM-listed modules and adequate unshaded roof area",
        "Bank account in applicant name for subsidy transfer",
    ]
    for item in elig_items:
        ip = elig_cell.add_paragraph()
        _para_space(ip, after=2)
        _run(ip, f"☐ {item}", size=9)

    _section_title(doc, "Documents — Subsidy Only")
    _checkbox_block(
        doc,
        [
            "Latest KSEB electricity bill (consumer number visible)",
            "Bank proof — passbook front page or cancelled cheque leaf showing applicant name, account number and IFSC (all three required)",
            "Aadhaar card (recommended for name verification on the portal)",
            "Mobile number linked to Aadhaar (for OTP on portal)",
            "Email ID for portal registration",
            "Written quotation / system proposal from empanelled installer",
        ],
        content_w,
    )

    _section_title(doc, "Documents — If Taking Bank Loan (additional)")
    _checkbox_block(
        doc,
        [
            "Property ownership proof (sale deed / tax receipt / possession certificate)",
            "PAN card of applicant",
            "Bank passbook from a nationalized bank (mandatory for loan cases)",
        ],
        content_w,
    )

    cta = doc.add_table(rows=1, cols=2)
    _set_table_width(cta, content_w)
    _no_borders(cta)
    c1, c2 = cta.rows[0].cells
    _shade(c1, "18B85C")
    _shade(c2, "18B85C")
    _margins(c1, 90, 90, 110, 60)
    _margins(c2, 90, 90, 60, 110)
    c2.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
    p1 = c1.paragraphs[0]
    _run(p1, "Not sure if you qualify?\n", bold=True, size=10, color=WHITE)
    _run(
        p1,
        "WhatsApp your latest KSEB bill — FGE Solar will confirm PM Surya Ghar eligibility, recommend system size, and explain next steps. Free. No obligation.",
        size=9.5,
        color=WHITE,
    )
    p2 = c2.paragraphs[0]
    p2.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    _run(p2, "+91 80890 73029", bold=True, size=14, color=WHITE)

    myth = doc.add_table(rows=1, cols=2)
    _set_table_width(myth, content_w)
    _no_borders(myth)
    m1, m2 = myth.rows[0].cells
    _shade(m1, "FFF1F2")
    _shade(m2, "ECFDF3")
    _margins(m1, 80, 80, 90, 90)
    _margins(m2, 80, 80, 90, 90)
    _run(m1.paragraphs[0], "COMMON CONFUSION", bold=True, size=8, color=INK)
    _run(m1.add_paragraph(), '"Subsidy is paid upfront before installation."', size=9)
    _run(m2.paragraphs[0], "THE REALITY", bold=True, size=8, color=INK)
    _run(
        m2.add_paragraph(),
        "CFA is processed after installation, DISCOM inspection/approval, and required portal checks on pmsuryaghar.gov.in.",
        size=9,
    )

    tip = doc.add_table(rows=1, cols=1)
    _set_table_width(tip, content_w)
    _no_borders(tip)
    tc = tip.rows[0].cells[0]
    _shade(tc, "FFFBEB")
    _margins(tc, 80, 80, 100, 100)
    _run(tc.paragraphs[0], "FGE tip: ", bold=True, size=9)
    _run(
        tc.paragraphs[0],
        "Send us your document photos on WhatsApp before portal upload — we catch missing IFSC details and blurry scans early, so your application moves faster.",
        size=9,
    )

    foot = doc.add_paragraph()
    foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    _para_space(foot, before=6)
    _run(foot, "Portal: pmsuryaghar.gov.in · Edition: September 2026 · Page 1 of 2", size=8, color=MUTED)

    doc.add_page_break()

    # Page 2
    _header(doc, "PM Surya Ghar Step Tracker", fields_right, content_w)

    _section_title(doc, "Application & Installation Milestones")
    steps = [
        ("Register on pmsuryaghar.gov.in", "Basic details + KSEB connection submitted"),
        ("Technical feasibility / DISCOM stage", "Track live status in portal (KSERC 2025 process applies in Kerala)"),
        ("Select FGE Solar on the portal", "Choose FGE Solar / Future Green Energy Group from the MNRE-empanelled vendor list"),
        ("Sign agreement & upload documents", "FGE Solar prepares and submits your portal file pack"),
        ("Rooftop installation by FGE Solar", "Panels, inverter, protections, commissioning — typically 2–4 days"),
        ("Project completion report filed", "FGE Solar uploads completion details on the portal"),
        ("KSEB / DISCOM inspection", "Technical inspection — FGE follows up on scheduling"),
        ("Net meter installed", "KSEB commissions bidirectional meter for export credits"),
        ("CFA processed after approvals", "Subsidy credited to beneficiary bank / eligible loan account — timing varies"),
    ]
    for i, (title, detail) in enumerate(steps, start=1):
        st = doc.add_table(rows=1, cols=2)
        _set_table_width(st, content_w)
        _no_borders(st)
        n_cell, t_cell = st.rows[0].cells
        n_cell.width = Cm(0.65)
        _margins(n_cell, 0, 30, 0, 50)
        _margins(t_cell, 0, 30, 0, 0)
        _run(n_cell.paragraphs[0], str(i), bold=True, size=9, color=WHITE)
        _shade(n_cell, "18B85C")
        _run(t_cell.paragraphs[0], f"{title}\n", bold=True, size=9.5, color=INK)
        _run(t_cell.paragraphs[0], detail, size=8.5, color=MUTED)

    why = doc.add_table(rows=1, cols=1)
    _set_table_width(why, content_w)
    _no_borders(why)
    wc = why.rows[0].cells[0]
    _shade(wc, "ECFDF3")
    _margins(wc, 90, 90, 100, 100)
    _run(wc.paragraphs[0], "WHY HOMEOWNERS CHOOSE FGE SOLAR FOR PM SURYA GHAR", bold=True, size=8, color=GREEN)
    for item in (
        "Free site assessment & system sizing for your roof",
        "Full portal registration & document submission handled",
        "KSEB net metering application & follow-up included",
        "ALMM-listed panels with written warranty & scope",
        "Serving all 14 districts across Kerala",
        "Itemised quote showing subsidy & your net cost",
    ):
        wp = wc.add_paragraph()
        _para_space(wp, after=2)
        _run(wp, f"✓ {item}", size=9)

    bottom = doc.add_table(rows=1, cols=2)
    _set_table_width(bottom, content_w)
    _no_borders(bottom)
    b1, b2 = bottom.rows[0].cells
    b1.width = Cm(half)
    b2.width = Cm(half)
    _margins(b1, 0, 0, 0, 80)
    _margins(b2, 0, 0, 80, 0)
    _shade(b2, "172219")
    _run(b1.paragraphs[0], "BEFORE YOU SIGN WITH ANY INSTALLER", bold=True, size=9, color=INK)
    for item in (
        "Written itemised quote (capacity, brands, warranty, scope)",
        "ALMM-listed module and inverter details confirmed",
        "Who handles KSEB / portal paperwork clearly stated",
        "Installer is MNRE-empanelled & selectable on pmsuryaghar.gov.in",
    ):
        bp = b1.add_paragraph()
        _run(bp, f"☐ {item}", size=9)
    rp = b2.paragraphs[0]
    _run(rp, "Ready to start?\n", bold=True, size=10, color=WHITE)
    _run(rp, "Message us on WhatsApp with:\n", size=9, color=LIGHT)
    _run(rp, "• Your district\n• Latest KSEB bill photo\n• Roof photo (if available)\n", size=9, color=LIGHT)
    _run(rp, "+91 80890 73029", bold=True, size=12, color=GREEN_BRIGHT)

    final = doc.add_table(rows=1, cols=1)
    _set_table_width(final, content_w)
    _no_borders(final)
    fc = final.rows[0].cells[0]
    _shade(fc, "172219")
    _margins(fc, 110, 110, 120, 120)
    fp = fc.paragraphs[0]
    fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    _run(fp, "Book Your Free Site Visit with FGE Solar\n", bold=True, size=15, color=WHITE, font="Georgia")
    _run(
        fp,
        "We handle PM Surya Ghar registration, installation, KSEB net metering, and subsidy milestone tracking — so you don't have to chase the portal alone.\n",
        size=9,
        color=LIGHT,
    )
    _run(fp, "WhatsApp +91 80890 73029\n", bold=True, size=11, color=GREEN_BRIGHT)
    _run(fp, 'Say: "I want PM Surya Ghar — please check my eligibility"', size=8, color=RGBColor(0xB8, 0xD4, 0xBC))

    disc = doc.add_paragraph()
    _para_space(disc, before=8)
    _run(disc, "Note: ", bold=True, size=8)
    _run(
        disc,
        "PM Surya Ghar subsidy rules and CFA rates are updated from time to time by MNRE. This checklist is for general guidance — always confirm the latest scheme details on the official National Portal before applying.",
        size=8,
        color=MUTED,
    )

    foot2 = doc.add_paragraph()
    foot2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    _run(foot2, "© FGE Solar (Future Green Energy Group) · Page 2 of 2", size=8, color=MUTED)

    docx_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(docx_path)
