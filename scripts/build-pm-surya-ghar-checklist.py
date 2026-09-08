#!/usr/bin/env python3
"""Build PM Surya Ghar checklist HTML + PDF with embedded FGE logo."""

from __future__ import annotations

import base64
import io
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
LOGO_PATH = ROOT / "assets" / "images" / "logo" / "logo.png"
HTML_OUT = ROOT / "subsidy" / "pm-surya-ghar-checklist.html"
PDF_OUT = ROOT / "assets" / "downloads" / "pm-surya-ghar-checklist.pdf"
DOCX_OUT = ROOT / "assets" / "downloads" / "pm-surya-ghar-checklist.docx"
WORD_HTML_OUT = ROOT / "subsidy" / "pm-surya-ghar-checklist-word.html"
CHROME = pathlib.Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")


def logo_data_uri() -> str:
    from PIL import Image

    img = Image.open(LOGO_PATH).convert("RGBA")
    img = img.resize((172, 172), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    encoded = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/png;base64,{encoded}"


def build_html(logo_src: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PM Surya Ghar Application Checklist 2026 (Kerala) | FGE Solar</title>
  <meta name="robots" content="noindex, nofollow">
  <style>
    :root {{
      --green: #18B85C;
      --green-dark: #12963F;
      --green-bright: #4ADE80;
      --ink: #172219;
      --ink-2: #1E2D22;
      --muted: #5B645C;
      --line: #D8E6DB;
      --paper: #FFFFFF;
      --sage: #F4FAF6;
      --rose: #FFF1F2;
      --rose-line: #FECDD3;
      --mint: #ECFDF3;
      --mint-line: #BBF7D0;
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}

    @page {{ size: A4; margin: 0; }}

    body {{
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      color: var(--ink);
      background: #E8EEE9;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }}

    .sheet {{
      width: 210mm;
      margin: 0 auto;
      background: var(--paper);
    }}

    .page {{
      min-height: 297mm;
      padding: 12mm 12mm 10mm;
      page-break-after: always;
      position: relative;
    }}

    .page:last-child {{ page-break-after: auto; }}

    .top-band {{
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: flex-start;
      background: linear-gradient(135deg, var(--ink), var(--ink-2));
      color: #fff;
      border-radius: 16px;
      padding: 14px 16px;
      margin-bottom: 14px;
    }}

    .brand {{
      display: flex;
      gap: 12px;
      align-items: center;
    }}

    .brand img {{
      width: 54px;
      height: 54px;
      border-radius: 12px;
      background: #fff;
      padding: 4px;
    }}

    .brand h1 {{
      font-family: Georgia, "Times New Roman", serif;
      font-size: 22px;
      line-height: 1.1;
      margin-bottom: 2px;
    }}

    .brand .sub {{
      font-size: 9px;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.72);
    }}

    .contact {{
      text-align: right;
      font-size: 10px;
      line-height: 1.55;
      color: rgba(255,255,255,0.82);
    }}

    .contact strong {{
      display: block;
      color: var(--green-bright);
      font-size: 9px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }}

    .contact .phone {{
      display: block;
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      margin-top: 2px;
    }}

    .eyebrow {{
      display: inline-block;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--green);
      margin-bottom: 6px;
    }}

    .hero h2 {{
      font-family: Georgia, "Times New Roman", serif;
      font-size: 28px;
      line-height: 1.12;
      margin-bottom: 8px;
      color: var(--ink);
    }}

    .hero p {{
      font-size: 12px;
      color: var(--muted);
      max-width: 92%;
    }}

    .grid-2 {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 12px 0;
    }}

    .panel {{
      border: 1px solid var(--line);
      border-radius: 14px;
      overflow: hidden;
      background: var(--sage);
    }}

    .panel-head {{
      background: var(--ink);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 8px 10px;
    }}

    .panel-body {{ padding: 10px; }}

    table {{
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
    }}

    th, td {{
      border: 1px solid var(--line);
      padding: 6px 8px;
      text-align: left;
    }}

    th {{
      background: #233026;
      color: #fff;
      font-size: 9px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }}

    .checklist {{
      list-style: none;
      display: grid;
      gap: 6px;
    }}

    .checklist li {{
      display: grid;
      grid-template-columns: 13px 1fr;
      gap: 7px;
      align-items: start;
      font-size: 11px;
      color: #2E342F;
    }}

    .box {{
      width: 12px;
      height: 12px;
      border: 1.5px solid #8FA897;
      border-radius: 2px;
      margin-top: 2px;
    }}

    .section-title {{
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ink);
      border-left: 4px solid var(--green);
      padding-left: 8px;
      margin: 12px 0 8px;
    }}

    .tip {{
      margin-top: 10px;
      padding: 9px 10px;
      border-radius: 10px;
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      font-size: 10px;
      color: #5B4B1F;
    }}

    .steps {{
      display: grid;
      gap: 7px;
    }}

    .step {{
      display: grid;
      grid-template-columns: 22px 1fr;
      gap: 8px;
      align-items: start;
      font-size: 11px;
    }}

    .step-num {{
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--green);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    .step strong {{ display: block; margin-bottom: 1px; }}
    .step span {{ color: var(--muted); font-size: 10px; }}

    .fields {{
      display: grid;
      gap: 6px;
      font-size: 11px;
      color: rgba(255,255,255,0.9);
      margin-top: 6px;
    }}

    .fields div {{
      border-bottom: 1px solid rgba(255,255,255,0.25);
      padding-bottom: 2px;
    }}

    .myth-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 10px;
    }}

    .myth, .reality {{
      border-radius: 12px;
      padding: 10px;
      font-size: 10px;
      line-height: 1.5;
    }}

    .myth {{
      background: var(--rose);
      border: 1px solid var(--rose-line);
    }}

    .reality {{
      background: var(--mint);
      border: 1px solid var(--mint-line);
    }}

    .myth h4, .reality h4 {{
      font-size: 9px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 5px;
    }}

    .contact-card {{
      background: linear-gradient(135deg, var(--ink), var(--ink-2));
      color: rgba(255,255,255,0.86);
      border-radius: 14px;
      padding: 12px;
      font-size: 11px;
    }}

    .contact-card strong {{ color: #fff; }}

    .footer {{
      position: absolute;
      left: 12mm;
      right: 12mm;
      bottom: 8mm;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: var(--muted);
      border-top: 1px solid var(--line);
      padding-top: 6px;
    }}

    .disclaimer {{
      margin-top: 10px;
      font-size: 9px;
      color: var(--muted);
      line-height: 1.5;
      border-top: 1px dashed var(--line);
      padding-top: 8px;
    }}

    .cta-band {{
      margin-top: 10px;
      border-radius: 12px;
      padding: 10px 12px;
      background: linear-gradient(135deg, var(--green), #12963F);
      color: #fff;
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: center;
    }}

    .cta-band strong {{
      display: block;
      font-size: 11px;
      margin-bottom: 2px;
    }}

    .cta-band p {{
      font-size: 10px;
      line-height: 1.45;
      opacity: 0.95;
      margin: 0;
    }}

    .cta-band .cta-phone {{
      flex-shrink: 0;
      text-align: right;
      font-size: 14px;
      font-weight: 700;
      white-space: nowrap;
    }}

    .why-fge {{
      margin-top: 10px;
      border: 1px solid var(--mint-line);
      border-radius: 12px;
      background: var(--mint);
      padding: 10px 12px;
    }}

    .why-fge h4 {{
      font-size: 10px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--green-dark, #12963F);
      margin-bottom: 8px;
    }}

    .why-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 10px;
    }}

    .why-item {{
      font-size: 10px;
      line-height: 1.4;
      color: #1F3D28;
      padding-left: 12px;
      position: relative;
    }}

    .why-item::before {{
      content: "✓";
      position: absolute;
      left: 0;
      color: var(--green);
      font-weight: 700;
    }}

    .cta-final {{
      margin-top: 10px;
      border-radius: 14px;
      padding: 12px 14px;
      background: linear-gradient(135deg, var(--ink), var(--ink-2));
      color: #fff;
      text-align: center;
    }}

    .cta-final h4 {{
      font-family: Georgia, "Times New Roman", serif;
      font-size: 16px;
      margin-bottom: 4px;
    }}

    .cta-final p {{
      font-size: 10px;
      color: rgba(255,255,255,0.82);
      line-height: 1.5;
      margin-bottom: 8px;
    }}

    .cta-final .cta-phone {{
      display: inline-block;
      background: var(--green);
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      padding: 7px 14px;
      border-radius: 8px;
    }}

    .cta-final .cta-sub {{
      display: block;
      margin-top: 6px;
      font-size: 9px;
      color: rgba(255,255,255,0.65);
    }}

    @media print {{
      body {{ background: #fff; }}
      .sheet {{ width: 100%; margin: 0; }}
    }}
  </style>
</head>
<body>
  <main class="sheet">
    <section class="page">
      <header class="top-band">
        <div class="brand">
          <img src="{logo_src}" alt="FGE Solar logo" width="54" height="54">
          <div>
            <h1>FGE Solar</h1>
            <div class="sub">Future Green Energy Group</div>
          </div>
        </div>
        <div class="contact">
          <strong>Expert Consultation</strong>
          <span>MNRE empanelled · Kerala-wide</span>
          <span class="phone">+91 80890 73029</span>
          <span>info@fgesolar.in</span>
        </div>
      </header>

      <div class="hero">
        <span class="eyebrow">Official 2026 Homeowner Checklist</span>
        <h2>PM Surya Ghar Application Checklist for Kerala</h2>
        <p>Use this printable checklist before registering on the National Portal. FGE Solar — MNRE empanelled across all 14 Kerala districts — can handle your eligibility check, portal registration, installation, and KSEB net metering.</p>
      </div>

      <div class="grid-2">
        <div class="panel">
          <div class="panel-head">Central Financial Assistance (Residential)</div>
          <div class="panel-body">
            <table>
              <thead>
                <tr><th>System size</th><th>CFA amount</th></tr>
              </thead>
              <tbody>
                <tr><td>1 kW</td><td>₹30,000</td></tr>
                <tr><td>2 kW</td><td>₹60,000</td></tr>
                <tr><td>3 kW and above</td><td>₹78,000 maximum</td></tr>
              </tbody>
            </table>
            <p style="font-size:10px;color:var(--muted);margin-top:8px;">Current CFA guideline: ₹30,000/kW for first 2 kW + ₹18,000 for the additional third kW, capped at ₹78,000. Subsidy scheme rates are revised periodically — confirm the latest CFA on the National Portal before applying.</p>
          </div>
        </div>
        <div class="panel">
          <div class="panel-head">Quick Eligibility Self-Check</div>
          <div class="panel-body">
            <ul class="checklist">
              <li><span class="box"></span><span>Indian citizen with valid KSEB electricity connection in your name</span></li>
              <li><span class="box"></span><span>Residential consumer applying for PM Surya Ghar rooftop subsidy</span></li>
              <li><span class="box"></span><span>Have not already received PM Surya Ghar subsidy on this KSEB consumer number (one-time per connection)</span></li>
              <li><span class="box"></span><span>Installing through an MNRE-empanelled vendor (e.g. FGE Solar)</span></li>
              <li><span class="box"></span><span>ALMM-listed modules and adequate unshaded roof area</span></li>
              <li><span class="box"></span><span>Bank account in applicant name for subsidy transfer</span></li>
            </ul>
          </div>
        </div>
      </div>

      <h3 class="section-title">Documents — Subsidy Only</h3>
      <ul class="checklist">
        <li><span class="box"></span><span>Latest KSEB electricity bill (consumer number visible)</span></li>
        <li><span class="box"></span><span>Bank proof — passbook front page or cancelled cheque leaf showing <strong>applicant name, account number and IFSC</strong> (all three required)</span></li>
        <li><span class="box"></span><span>Aadhaar card (recommended for name verification on the portal)</span></li>
        <li><span class="box"></span><span>Mobile number linked to Aadhaar (for OTP on portal)</span></li>
        <li><span class="box"></span><span>Email ID for portal registration</span></li>
        <li><span class="box"></span><span>Written quotation / system proposal from empanelled installer</span></li>
      </ul>

      <h3 class="section-title" style="margin-top:10px;">Documents — If Taking Bank Loan (additional)</h3>
      <ul class="checklist">
        <li><span class="box"></span><span>Property ownership proof (sale deed / tax receipt / possession certificate)</span></li>
        <li><span class="box"></span><span>PAN card of applicant</span></li>
        <li><span class="box"></span><span>Bank passbook from a <strong>nationalized bank</strong> (mandatory for loan cases)</span></li>
      </ul>

      <div class="cta-band">
        <div>
          <strong>Not sure if you qualify?</strong>
          <p>WhatsApp your latest KSEB bill — FGE Solar will confirm PM Surya Ghar eligibility, recommend system size, and explain next steps. Free. No obligation.</p>
        </div>
        <div class="cta-phone">+91 80890 73029</div>
      </div>

      <div class="myth-grid">
        <div class="myth">
          <h4>Common confusion</h4>
          <p>"Subsidy is paid upfront before installation."</p>
        </div>
        <div class="reality">
          <h4>The reality</h4>
          <p>CFA is processed after installation, DISCOM inspection/approval, and required portal checks on pmsuryaghar.gov.in.</p>
        </div>
      </div>

      <div class="tip"><strong>FGE tip:</strong> Send us your document photos on WhatsApp before portal upload — we catch missing IFSC details and blurry scans early, so your application moves faster.</div>

      <footer class="footer">
        <span>Portal: pmsuryaghar.gov.in · Edition: September 2026</span>
        <span>Page 1 of 2</span>
      </footer>
    </section>

    <section class="page">
      <header class="top-band">
        <div class="brand">
          <img src="{logo_src}" alt="" width="54" height="54" aria-hidden="true">
          <div>
            <h1>FGE Solar</h1>
            <div class="sub">PM Surya Ghar Step Tracker</div>
          </div>
        </div>
        <div class="contact">
          <div class="fields">
            <div><strong>Applicant name:</strong> ________________________________</div>
            <div><strong>KSEB consumer no.:</strong> _____________________________</div>
            <div><strong>District:</strong> _______________________________________</div>
          </div>
        </div>
      </header>

      <h3 class="section-title">Application &amp; Installation Milestones</h3>
      <div class="steps">
        <div class="step"><div class="step-num">1</div><div><strong>Register on pmsuryaghar.gov.in</strong><span>Basic details + KSEB connection submitted</span></div></div>
        <div class="step"><div class="step-num">2</div><div><strong>Technical feasibility / DISCOM stage</strong><span>Track live status in portal (KSERC 2025 process applies in Kerala)</span></div></div>
        <div class="step"><div class="step-num">3</div><div><strong>Select FGE Solar on the portal</strong><span>Choose FGE Solar / Future Green Energy Group from the MNRE-empanelled vendor list</span></div></div>
        <div class="step"><div class="step-num">4</div><div><strong>Sign agreement &amp; upload documents</strong><span>FGE Solar prepares and submits your portal file pack</span></div></div>
        <div class="step"><div class="step-num">5</div><div><strong>Rooftop installation by FGE Solar</strong><span>Panels, inverter, protections, commissioning — typically 2–4 days</span></div></div>
        <div class="step"><div class="step-num">6</div><div><strong>Project completion report filed</strong><span>FGE Solar uploads completion details on the portal</span></div></div>
        <div class="step"><div class="step-num">7</div><div><strong>KSEB / DISCOM inspection</strong><span>Technical inspection — FGE follows up on scheduling</span></div></div>
        <div class="step"><div class="step-num">8</div><div><strong>Net meter installed</strong><span>KSEB commissions bidirectional meter for export credits</span></div></div>
        <div class="step"><div class="step-num">9</div><div><strong>CFA processed after approvals</strong><span>Subsidy credited to beneficiary bank / eligible loan account — timing varies</span></div></div>
      </div>

      <div class="why-fge">
        <h4>Why homeowners choose FGE Solar for PM Surya Ghar</h4>
        <div class="why-grid">
          <div class="why-item">Free site assessment &amp; system sizing for your roof</div>
          <div class="why-item">Full portal registration &amp; document submission handled</div>
          <div class="why-item">KSEB net metering application &amp; follow-up included</div>
          <div class="why-item">ALMM-listed panels with written warranty &amp; scope</div>
          <div class="why-item">Serving all 14 districts across Kerala</div>
          <div class="why-item">Itemised quote showing subsidy &amp; your net cost</div>
        </div>
      </div>

      <div class="grid-2" style="margin-top:10px;">
        <div>
          <h3 class="section-title">Before You Sign With Any Installer</h3>
          <ul class="checklist">
            <li><span class="box"></span><span>Written itemised quote (capacity, brands, warranty, scope)</span></li>
            <li><span class="box"></span><span>ALMM-listed module and inverter details confirmed</span></li>
            <li><span class="box"></span><span>Who handles KSEB / portal paperwork clearly stated</span></li>
            <li><span class="box"></span><span>Installer is MNRE-empanelled &amp; selectable on pmsuryaghar.gov.in</span></li>
          </ul>
        </div>
        <div class="contact-card">
          <p style="margin-bottom:6px;"><strong>Ready to start?</strong></p>
          <p>Message us on WhatsApp with:</p>
          <p style="margin:6px 0;opacity:0.9;">• Your district<br>• Latest KSEB bill photo<br>• Roof photo (if available)</p>
          <p style="margin-top:6px;font-weight:700;color:#8ee4b0;">+91 80890 73029</p>
        </div>
      </div>

      <div class="cta-final">
        <h4>Book Your Free Site Visit with FGE Solar</h4>
        <p>We handle PM Surya Ghar registration, installation, KSEB net metering, and subsidy milestone tracking — so you don't have to chase the portal alone.</p>
        <span class="cta-phone">WhatsApp +91 80890 73029</span>
        <span class="cta-sub">Say: "I want PM Surya Ghar — please check my eligibility"</span>
      </div>

      <p class="disclaimer"><strong>Note:</strong> PM Surya Ghar subsidy rules and CFA rates are updated from time to time by MNRE. This checklist is for general guidance — always confirm the latest scheme details on the official National Portal before applying.</p>

      <footer class="footer">
        <span>© FGE Solar (Future Green Energy Group)</span>
        <span>Page 2 of 2</span>
      </footer>
    </section>
  </main>
</body>
</html>
"""


def export_docx(docx_path: pathlib.Path, logo_src: str) -> None:
    script_dir = pathlib.Path(__file__).resolve().parent
    if str(script_dir) not in sys.path:
        sys.path.insert(0, str(script_dir))
    from checklist_docx import build_checklist_docx

    build_checklist_docx(docx_path)


def export_pdf(html_path: pathlib.Path, pdf_path: pathlib.Path) -> None:
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    if not CHROME.exists():
        raise FileNotFoundError(f"Chrome not found at {CHROME}")

    uri = html_path.resolve().as_uri()
    subprocess.run(
        [
            str(CHROME),
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--print-to-pdf={pdf_path}",
            uri,
        ],
        check=True,
        capture_output=True,
        text=True,
    )


def main() -> int:
    logo_src = logo_data_uri()
    html = build_html(logo_src)
    HTML_OUT.write_text(html, encoding="utf-8")
    export_pdf(HTML_OUT, PDF_OUT)
    export_docx(DOCX_OUT, logo_src)
    print(f"Wrote HTML: {HTML_OUT}")
    print(f"Wrote PDF:  {PDF_OUT} ({PDF_OUT.stat().st_size} bytes)")
    print(f"Wrote DOCX: {DOCX_OUT} ({DOCX_OUT.stat().st_size} bytes)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
