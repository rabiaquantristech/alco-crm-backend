module.exports = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Invoice</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet"/>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --ink: #0f1117; --ink-soft: #4a5060; --ink-muted: #8a92a6;
    --accent: #1a3a5c; --accent-light: #e8f0f8;
    --gold: #c8a84b; --gold-light: #fdf6e3;
    --border: #dde2ec; --white: #ffffff; --bg: #f4f6fb;
    --paid-bg: #eafaf3; --paid-text: #1a8a57;
    --pending-bg: #fff8e8; --pending-text: #b07800;
  }
  body { font-family: 'Syne', sans-serif; background: var(--bg); color: var(--ink); }
  #invoice-wrapper { width: 100%; max-width: 860px; margin: auto; background: var(--white); }
  .inv-header { background: var(--accent); padding: 36px 44px 30px; display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; }
  .brand-block { display: flex; flex-direction: column; gap: 6px; }
  .brand-logo { display: flex; align-items: center; gap: 12px; }
  .brand-icon { width: 44px; height: 44px; background: var(--gold); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; color: var(--accent); flex-shrink: 0; }
  .brand-name { font-size: 22px; font-weight: 800; color: var(--white); letter-spacing: -0.02em; line-height: 1; }
  .brand-tagline { font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 400; letter-spacing: 0.12em; text-transform: uppercase; margin-top: 2px; }
  .brand-address { font-size: 11.5px; color: rgba(255,255,255,0.60); line-height: 1.7; margin-top: 14px; }
  .inv-num-block { text-align: right; }
  .inv-label { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.50); margin-bottom: 6px; }
  .inv-number { font-family: 'IBM Plex Mono', monospace; font-size: 26px; font-weight: 600; color: var(--white); }
  .inv-status-badge { display: inline-block; margin-top: 10px; padding: 5px 14px; border-radius: 50px; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; background: var(--pending-bg); color: var(--pending-text); }
  .gold-line { height: 3px; background: linear-gradient(90deg, var(--gold), #e8c96a, var(--gold)); }
  .meta-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0; border-bottom: 1px solid var(--border); }
  .meta-cell { padding: 22px 28px; border-right: 1px solid var(--border); }
  .meta-cell:last-child { border-right: none; }
  .meta-cell-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-muted); margin-bottom: 5px; }
  .meta-cell-value { font-size: 13.5px; font-weight: 700; color: var(--ink); }
  .meta-cell-value.mono { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; }
  .inv-body { padding: 32px 44px; }
  .parties-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 36px; }
  .party-card { background: var(--bg); border-radius: 14px; padding: 20px 22px; border: 1px solid var(--border); }
  .party-heading { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.13em; color: var(--ink-muted); margin-bottom: 12px; display: flex; align-items: center; gap: 7px; }
  .party-heading::before { content: ''; display: inline-block; width: 16px; height: 2px; background: var(--gold); border-radius: 2px; }
  .party-name { font-size: 15px; font-weight: 800; color: var(--ink); margin-bottom: 5px; text-transform: capitalize; }
  .party-detail { font-size: 12px; color: var(--ink-soft); line-height: 1.8; }
  .party-detail span { font-weight: 600; color: var(--ink); }
  .program-band { background: var(--accent-light); border: 1px solid #c5d8ee; border-radius: 12px; padding: 14px 20px; margin-bottom: 28px; display: flex; align-items: center; gap: 14px; }
  .program-icon { width: 36px; height: 36px; background: var(--accent); border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .program-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); margin-bottom: 2px; }
  .program-name { font-size: 14px; font-weight: 800; color: var(--accent); }
  .program-note { margin-left: auto; font-size: 11.5px; color: var(--ink-soft); font-style: italic; max-width: 220px; text-align: right; line-height: 1.5; }
  .table-section { margin-bottom: 28px; }
  .table-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-muted); margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
  thead tr { background: var(--accent); }
  thead th { padding: 12px 16px; text-align: left; font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.75); }
  thead th:last-child { text-align: right; }
  tbody tr { border-bottom: 1px solid var(--border); }
  tbody tr:last-child { border-bottom: none; }
  tbody tr.advance-row { background: var(--gold-light); }
  tbody td { padding: 13px 16px; font-size: 13px; color: var(--ink); }
  tbody td:last-child { text-align: right; }
  .td-num { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; font-weight: 600; color: var(--ink-muted); }
  .td-desc { font-weight: 700; }
  .td-desc small { display: block; font-size: 10.5px; font-weight: 400; color: var(--ink-muted); margin-top: 1px; }
  .td-date { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--ink-soft); }
  .td-amount { font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 13.5px; }
  .badge-advance { display: inline-block; background: var(--gold); color: #5a3a00; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 2px 8px; border-radius: 4px; margin-left: 7px; vertical-align: middle; }
  .inst-status { display: inline-block; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 3px 9px; border-radius: 5px; background: var(--pending-bg); color: var(--pending-text); }
  .inst-status.paid { background: var(--paid-bg); color: var(--paid-text); }
  .totals-block { display: flex; justify-content: flex-end; margin-bottom: 32px; }
  .totals-inner { width: 320px; border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
  .total-row { display: flex; justify-content: space-between; align-items: center; padding: 11px 18px; border-bottom: 1px solid var(--border); font-size: 13px; }
  .total-row:last-child { border-bottom: none; }
  .total-row-label { color: var(--ink-soft); font-weight: 500; }
  .total-row-value { font-family: 'IBM Plex Mono', monospace; font-weight: 600; color: var(--ink); font-size: 13px; }
  .total-row.grand { background: var(--accent); font-size: 14px; }
  .total-row.grand .total-row-label { color: rgba(255,255,255,0.7); font-weight: 600; }
  .total-row.grand .total-row-value { color: var(--white); font-size: 15px; }
  .total-row.remaining-row .total-row-value { color: #c94040; }
  .total-row.paid-row .total-row-value { color: var(--paid-text); }
  .notes-block { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; margin-bottom: 32px; }
  .notes-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--ink-muted); margin-bottom: 6px; }
  .notes-text { font-size: 13px; color: var(--ink-soft); line-height: 1.6; }
  .inv-footer { border-top: 1px solid var(--border); padding: 22px 44px; display: flex; align-items: center; justify-content: space-between; background: var(--bg); }
  .footer-left { font-size: 11px; color: var(--ink-muted); line-height: 1.7; }
  .footer-left strong { color: var(--ink-soft); display: block; margin-bottom: 2px; font-size: 12px; }
  .footer-right { text-align: right; font-size: 11px; color: var(--ink-muted); }
  .footer-brand { font-size: 13px; font-weight: 800; color: var(--accent); letter-spacing: -0.02em; }
  .footer-divider { width: 1px; height: 48px; background: var(--border); flex-shrink: 0; }
</style>
</head>
<body>
<div id="invoice-wrapper">

  <div class="inv-header">
    <div class="brand-block">
      <div class="brand-logo">
        <div class="brand-icon">AL</div>
        <div>
          <div class="brand-name">ALCO</div>
          <div class="brand-tagline">Academy of Life Coaching</div>
        </div>
      </div>
      <div class="brand-address">
        Karachi, Pakistan<br/>
        info@alco.com &nbsp;|&nbsp; +92 300 0000000<br/>
        www.alco.com
      </div>
    </div>
    <div class="inv-num-block">
      <div class="inv-label">Invoice Number</div>
      <div class="inv-number">{{invoiceNumber}}</div>
      <div class="inv-status-badge">{{invoiceStatus}}</div>
    </div>
  </div>

  <div class="gold-line"></div>

  <div class="meta-row">
    <div class="meta-cell">
      <div class="meta-cell-label">Issue Date</div>
      <div class="meta-cell-value mono">{{issueDate}}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-cell-label">Advance Due Date</div>
      <div class="meta-cell-value mono">{{advanceDueDate}}</div>
    </div>
    <div class="meta-cell">
      <div class="meta-cell-label">Enrollment ID</div>
      <div class="meta-cell-value mono" style="font-size:11px;color:var(--ink-soft)">{{enrollmentId}}</div>
    </div>
  </div>

  <div class="inv-body">

    <div class="parties-row">
      <div class="party-card">
        <div class="party-heading">Billed To</div>
        <div class="party-name">{{studentName}}</div>
        <div class="party-detail">
          {{studentEmail}}<br/>
          <span>{{studentPhone}}</span><br/>
          {{studentProfession}}
        </div>
      </div>
      <div class="party-card">
        <div class="party-heading">Issued By</div>
        <div class="party-name">ALCO &mdash; Finance Dept.</div>
        <div class="party-detail">
          Assigned Sales Manager:<br/>
          <span>{{salesManagerName}}</span><br/>
          {{salesManagerEmail}}
        </div>
      </div>
    </div>

    <div class="program-band">
      <div class="program-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>
      <div>
        <div class="program-label">Enrolled Program</div>
        <div class="program-name">{{programName}}</div>
      </div>
      <div class="program-note">{{planNotes}}</div>
    </div>

    <div class="table-section">
      <div class="table-title">Payment Schedule</div>
      <table>
        <thead>
          <tr>
            <th style="width:40px">#</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {{installmentRows}}
        </tbody>
      </table>
    </div>

    <div class="totals-block">
      <div class="totals-inner">
        <div class="total-row">
          <span class="total-row-label">Subtotal</span>
          <span class="total-row-value">Rs {{totalAmount}}</span>
        </div>
        <div class="total-row paid-row">
          <span class="total-row-label">Amount Paid</span>
          <span class="total-row-value">Rs {{paidAmount}}</span>
        </div>
        <div class="total-row remaining-row">
          <span class="total-row-label">Outstanding Balance</span>
          <span class="total-row-value">Rs {{remainingAmount}}</span>
        </div>
        <div class="total-row grand">
          <span class="total-row-label">Total Invoice Amount</span>
          <span class="total-row-value">Rs {{totalAmount}}</span>
        </div>
      </div>
    </div>

    <div class="notes-block">
      <div class="notes-label">Terms &amp; Notes</div>
      <div class="notes-text">
        Advance payment of <strong>Rs {{advanceAmount}}</strong> must be received by
        <strong>{{advanceDueDate}}</strong> to activate enrollment.
        Remaining installments are due monthly as per schedule above.
        Late payments may result in restricted portal access.
        For queries contact: <strong>finance@alco.com</strong>
      </div>
    </div>

  </div>

  <div class="inv-footer">
    <div class="footer-left">
      <strong>Payment Methods Accepted</strong>
      Cash &nbsp;|&nbsp; Bank Transfer &nbsp;|&nbsp; Cheque<br/>
      Account: ALCO Academy &nbsp;|&nbsp; HBL: 0123-456789-01
    </div>
    <div class="footer-divider"></div>
    <div class="footer-right">
      <div class="footer-brand">ALCO</div>
      <div style="margin-top:4px">This is a system-generated invoice.<br/>No signature required.</div>
    </div>
  </div>

</div>
</body>
</html>
`;
