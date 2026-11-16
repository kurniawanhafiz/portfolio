"""Generate CV_ID.pdf and CV_EN.pdf from one template (Chromium print-to-PDF).
Usage: python3 tools/build_cv.py   (needs playwright + chromium)"""
import html, subprocess, sys, pathlib, json

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "cv"
EMAIL = "fizallinone@gmail.com"

D = {
 "id": {
  "lang": "id", "file": "CV_Kurniawan_Hafiz_ID.pdf",
  "summary": "Mahasiswa S1 Sistem Informasi dengan rekam jejak berprestasi di bidang <i>Cloud Computing</i> dan <i>IT Network Systems Administration</i> hingga tingkat Nasional. Memiliki pengalaman komprehensif mulai dari instalasi infrastruktur fisik (<i>Fiber Optic</i>), administrasi server Linux (Debian/Red Hat), manajemen perangkat Cisco &amp; MikroTik, hingga <i>deployment</i> aplikasi web (<i>Continuous Deployment</i>). Memiliki fondasi teknis yang kuat dalam merancang arsitektur jaringan <i>cloud</i> (AWS) yang <i>highly available</i> dan aman. Bersemangat untuk memperdalam keahlian dan meraih sertifikasi profesional di ekosistem <i>Cloud Computing</i> (AWS).",
  "h_exp": "PENGALAMAN KERJA", "h_edu": "PENDIDIKAN", "h_proj": "PROYEK MANDIRI &amp; WEB DEPLOYMENT",
  "h_cert": "SERTIFIKASI", "h_train": "PELATIHAN", "h_ach": "PRESTASI", "h_skill": "KEAHLIAN TEKNIS",
  "exp": [("PT Global Riau Data Solusi", "Magang Teknisi Jaringan", "November 2025 - Maret 2026", [
     "Melaksanakan instalasi fisik infrastruktur <i>Internet Service Provider</i> (ISP) berbasis kabel <i>Fiber Optic</i> (FO) menggunakan instrumen teknis seperti <i>Fusion Splicer</i>, <i>Optical Power Meter</i> (OPM), dan <i>Optical Time-Domain Reflectometer</i> (OTDR).",
     "Melakukan instalasi dan konfigurasi perangkat <i>Optical Network Terminal</i> (ONT) di lokasi pelanggan, mencakup <i>setup PPPoE Client</i>, penyetelan SSID/Password WLAN, dan manajemen alamat IP.",
     "Memberikan dukungan teknis (<i>troubleshooting</i>) secara <i>on-site</i> untuk mendeteksi redaman kabel dan memastikan stabilitas konektivitas internet pelanggan."])],
  "edu": [("Universitas Riau", "S1 Sistem Informasi", "2026 - Sekarang"), ("SMK Negeri 1 Sijunjung", "Teknik Komputer dan Jaringan (TKJ)", "2023 - 2026")],
  "proj": ("Pengembangan Website Portofolio &amp; Sistem Sekolah", "Web Developer", [
     "Mengembangkan antarmuka <i>website</i> interaktif dan responsif menggunakan HTML, CSS, Bootstrap, dan Vanilla JavaScript.",
     "Mengelola integrasi <i>source code</i> menggunakan Git/GitHub dan melakukan proses <i>deployment</i> ke platform <i>cloud hosting</i> seperti Netlify dan Vercel.",
     "Mengkonfigurasi <i>Custom Domain</i> (.web.id) yang terintegrasi dengan sertifikat SSL/TLS (HTTPS) untuk memastikan keamanan dan profesionalitas <i>website</i>."]),
  "certs": [("Junior Technical Support Pusat Data", "Badan Nasional Sertifikasi Profesi (BNSP)", "Juni 2026 - Juni 2029"),
            ("Junior Technical Support", "Badan Nasional Sertifikasi Profesi (BNSP)", "Juni 2026 - Juni 2029")],
  "train": [("Getting Started with Linux Fundamentals", "Red Hat Academy", "31 Desember 2025")],
  "ach": [
   ("Lomba Kompetensi Siswa (LKS) Tingkat Provinsi Sumatera Barat", "5 - 7 Mei 2026", "Juara 3 bidang lomba Cloud Computing | 2026", [
     "Berhasil meraih Juara 3 dari 10 peserta perwakilan berbagai kabupaten/kota se-Sumatera Barat.",
     "Merancang dan mengimplementasikan arsitektur <i>cloud</i> publik pada <i>environment</i> AWS Academy.",
     "Membangun server virtual menggunakan komputasi EC2 Instances (Apache/Nginx) yang terintegrasi dengan layanan penyimpanan objek Amazon S3 Bucket untuk optimasi <i>Static Content</i>.",
     "Mengkonfigurasi infrastruktur <i>High Availability</i> (HA) dengan mengimplementasikan <i>Elastic Load Balancing</i> (ELB), simulasi <i>Auto Scaling</i>, dan pemantauan sistem (<i>Monitoring</i>) via Amazon CloudWatch.",
     "Mengamankan arsitektur menggunakan Security Group dan manajemen akses dasar menggunakan IAM."]),
   ("Lomba Kompetensi Siswa (LKS) Tingkat Nasional", "27 Juli - 1 Agustus 2025", "Finalis bidang lomba IT Network Systems Administration | 2025", [
     "Peringkat 18 dari 30 peserta perwakilan Provinsi dari seluruh Indonesia pada bidang lomba IT Network Systems Administration tingkat Nasional.",
     "Mewakili Provinsi Sumatera Barat di tingkat nasional dalam merancang, membangun, dan melakukan <i>troubleshooting</i> infrastruktur jaringan dan server berskala enterprise di bawah tekanan waktu (kompetisi tingkat tinggi).",
     "Berhasil mengkonfigurasi beberapa server Linux/Windows dengan berbagai layanan seperti Firewall, DNS Server, DHCP Server, Web Server (HTTP &amp; HTTPS), Mail Server (SMTP, POP3 &amp; IMAP), WebMail dan VPN Server.",
     "Berhasil mengkonfigurasi perangkat Router dan Switch Cisco dengan beberapa tugas seperti routing dinamis, VLAN, Inter-VLAN routing, Access Control List, Port Security, EtherChannel, Port Aggregation, DHCP Server/Client, VTP Server/Transparent/Client, dan DNS Server/Client."]),
   ("Lomba Kompetensi Siswa (LKS) Provinsi Sumatera Barat", "26 - 28 Mei 2025", "Juara 1 bidang lomba IT Network Systems Administration | 2025", [
     "Berhasil meraih Juara 1 dengan menyisihkan 10 peserta perwakilan dari berbagai kabupaten/kota se-Sumatera Barat.",
     "<b>MikroTik:</b> Berhasil mengkonfigurasi DHCP Client, manajemen Bandwidth (Queue), sistem Hotspot multikategori pengguna, Firewall Filter (RegExp &amp; Layer7) untuk pemblokiran situs, dan DNS Static.",
     "<b>Linux (Debian 12):</b> Mengelola 2 Virtual Server sekaligus yang mencakup layanan DNS, FTP, Database (phpMyAdmin), Web Server (WordPress), Web Mail Server, HTTPS (OpenSSL CA), SAMBA, NTP, SSH (Custom Port), Telnet Server, dan LDAP Server.",
     "<b>Cisco:</b> Berhasil mengkonfigurasi perangkat Switch dan Router mencakup VLAN (Access &amp; Trunk), Etherchannel (LACP), Access Control List (ACL), serta Routing Static."]),
   ("Lomba Kompetensi Siswa (LKS) Tingkat Kabupaten Sijunjung", "22 Februari 2025", "Juara 2 bidang lomba IT Network Systems Administration | 2025", [
     "Mengkonfigurasi Router Cisco dengan implementasi IP Point-to-Point, VLAN, DHCP Server, Routing Static, dan keamanan Telnet ACL."])],
  "skills": [
   ("Cloud Computing &amp; Deployment", "AWS (EC2, S3, ELB, CloudWatch, Security Group, IAM), Git/GitHub, Netlify, Vercel, <i>Custom Domain Management</i>, SSL/TLS."),
   ("IT Systems Administration", "Linux Debian &amp; Red Hat, Web Server (Apache/Nginx), Database Server (MySQL/phpMyAdmin), DNS, FTP, Mail Server, SAMBA, NTP, LDAP."),
   ("IT Network Administration", "Perangkat Cisco (<i>Routing/Switching</i>, VLAN, EtherChannel, ACL), MikroTik (Hotspot, <i>Bandwidth Management</i>, Firewall)."),
   ("Infrastruktur Fisik &amp; ISP", "Jaringan Fiber Optic, Fusion Splicer, OPM, OTDR, Konfigurasi Perangkat ONT."),
   ("Web Development", "HTML, CSS, Bootstrap, Vanilla JavaScript, WordPress.")],
 },
 "en": {
  "lang": "en", "file": "CV_Kurniawan_Hafiz_EN.pdf",
  "summary": "Information Systems undergraduate with an award-winning track record in <i>Cloud Computing</i> and <i>IT Network Systems Administration</i> up to the National level. Comprehensive experience ranging from physical infrastructure installation (<i>Fiber Optic</i>), Linux server administration (Debian/Red Hat) and Cisco &amp; MikroTik device management, to web application deployment (<i>Continuous Deployment</i>). Strong technical foundation in designing highly available and secure <i>cloud</i> network architectures (AWS). Eager to deepen expertise and earn professional certifications in the <i>Cloud Computing</i> (AWS) ecosystem.",
  "h_exp": "WORK EXPERIENCE", "h_edu": "EDUCATION", "h_proj": "INDEPENDENT PROJECTS &amp; WEB DEPLOYMENT",
  "h_cert": "CERTIFICATIONS", "h_train": "TRAINING", "h_ach": "ACHIEVEMENTS", "h_skill": "TECHNICAL SKILLS",
  "exp": [("PT Global Riau Data Solusi", "Network Technician Intern", "November 2025 - March 2026", [
     "Carried out physical installation of <i>Internet Service Provider</i> (ISP) infrastructure based on <i>Fiber Optic</i> (FO) cable using technical instruments such as a <i>Fusion Splicer</i>, <i>Optical Power Meter</i> (OPM) and <i>Optical Time-Domain Reflectometer</i> (OTDR).",
     "Installed and configured <i>Optical Network Terminal</i> (ONT) devices at customer sites, including PPPoE client setup, WLAN SSID/password configuration and IP address management.",
     "Provided on-site technical support (troubleshooting) to detect cable attenuation and ensure stable internet connectivity for customers."])],
  "edu": [("Universitas Riau", "Bachelor of Information Systems (S1)", "2026 - Present"), ("SMK Negeri 1 Sijunjung", "Computer and Network Engineering (TKJ)", "2023 - 2026")],
  "proj": ("Portfolio Website &amp; School System Development", "Web Developer", [
     "Developed interactive, responsive website interfaces using HTML, CSS, Bootstrap and Vanilla JavaScript.",
     "Managed source code integration with Git/GitHub and deployed to cloud hosting platforms such as Netlify and Vercel.",
     "Configured a custom domain (.web.id) integrated with an SSL/TLS (HTTPS) certificate to ensure website security and professionalism."]),
  "certs": [("Junior Technical Support Pusat Data (Data Center)", "National Professional Certification Agency (BNSP)", "June 2026 - June 2029"),
            ("Junior Technical Support", "National Professional Certification Agency (BNSP)", "June 2026 - June 2029")],
  "train": [("Getting Started with Linux Fundamentals", "Red Hat Academy", "31 December 2025")],
  "ach": [
   ("Student Competency Competition (LKS), West Sumatra Provincial Level", "5 - 7 May 2026", "3rd Place, Cloud Computing | 2026", [
     "Won 3rd place out of 10 participants representing regencies/cities across West Sumatra.",
     "Designed and implemented a public <i>cloud</i> architecture in the AWS Academy environment.",
     "Built virtual servers using EC2 instances (Apache/Nginx) integrated with Amazon S3 object storage for static content optimization.",
     "Configured High Availability (HA) infrastructure using <i>Elastic Load Balancing</i> (ELB), Auto Scaling simulation and monitoring via Amazon CloudWatch.",
     "Secured the architecture using Security Groups and basic access management with IAM."]),
   ("Student Competency Competition (LKS), National Level", "27 July - 1 August 2025", "Finalist, IT Network Systems Administration | 2025", [
     "Ranked 18th out of 30 provincial representatives from across Indonesia in IT Network Systems Administration at the national level.",
     "Represented West Sumatra Province nationally in designing, building and troubleshooting enterprise-scale network and server infrastructure under time pressure (high-level competition).",
     "Configured multiple Linux/Windows servers with services such as Firewall, DNS Server, DHCP Server, Web Server (HTTP &amp; HTTPS), Mail Server (SMTP, POP3 &amp; IMAP), WebMail and VPN Server.",
     "Configured Cisco routers and switches for tasks including dynamic routing, VLAN, Inter-VLAN routing, Access Control List, Port Security, EtherChannel, Port Aggregation, DHCP Server/Client, VTP Server/Transparent/Client and DNS Server/Client."]),
   ("Student Competency Competition (LKS), West Sumatra Provincial Level", "26 - 28 May 2025", "1st Place, IT Network Systems Administration | 2025", [
     "Won 1st place, beating 10 participants representing regencies/cities across West Sumatra.",
     "<b>MikroTik:</b> Configured DHCP Client, bandwidth management (Queue), a multi-category user Hotspot system, Firewall Filter (RegExp &amp; Layer7) for website blocking, and static DNS.",
     "<b>Linux (Debian 12):</b> Managed 2 virtual servers simultaneously covering DNS, FTP, Database (phpMyAdmin), Web Server (WordPress), Web Mail Server, HTTPS (OpenSSL CA), SAMBA, NTP, SSH (custom port), Telnet Server and LDAP Server.",
     "<b>Cisco:</b> Configured switches and routers covering VLAN (Access &amp; Trunk), EtherChannel (LACP), Access Control List (ACL) and static routing."]),
   ("Student Competency Competition (LKS), Sijunjung Regency Level", "22 February 2025", "2nd Place, IT Network Systems Administration | 2025", [
     "Configured a Cisco router with point-to-point IP, VLAN, DHCP Server, static routing and Telnet ACL security."])],
  "skills": [
   ("Cloud Computing &amp; Deployment", "AWS (EC2, S3, ELB, CloudWatch, Security Group, IAM), Git/GitHub, Netlify, Vercel, Custom Domain Management, SSL/TLS."),
   ("IT Systems Administration", "Linux Debian &amp; Red Hat, Web Server (Apache/Nginx), Database Server (MySQL/phpMyAdmin), DNS, FTP, Mail Server, SAMBA, NTP, LDAP."),
   ("IT Network Administration", "Cisco devices (Routing/Switching, VLAN, EtherChannel, ACL), MikroTik (Hotspot, Bandwidth Management, Firewall)."),
   ("Physical Infrastructure &amp; ISP", "Fiber Optic networks, Fusion Splicer, OPM, OTDR, ONT device configuration."),
   ("Web Development", "HTML, CSS, Bootstrap, Vanilla JavaScript, WordPress.")],
 },
}

def ul(items): return "<ul>" + "".join(f"<li>{i}</li>" for i in items) + "</ul>"

def render(d):
    p = []
    p.append(f'<h1>KURNIAWAN HAFIZ</h1>')
    p.append(f'<div class="contact"><a href="mailto:{EMAIL}">{EMAIL}</a> | LinkedIn: <a href="https://linkedin.com/in/kurniawanhafiz">kurniawanhafiz</a> | Portfolio: <a href="https://kurniawanhafiz.web.id">kurniawanhafiz.web.id</a> | Pekanbaru, Riau</div>')
    p.append(f'<p class="sum">{d["summary"]}</p>')
    p.append(f'<h2>{d["h_exp"]}</h2>')
    for org, role, date, b in d["exp"]:
        p.append(f'<div class="row"><span><b>{org}</b> | {role}</span><i>{date}</i></div>{ul(b)}')
    p.append(f'<h2>{d["h_edu"]}</h2>')
    for org, deg, date in d["edu"]:
        p.append(f'<div class="row"><span><b>{org}</b><br>{deg}</span><i>{date}</i></div>')
    t, r, b = d["proj"]
    p.append(f'<h2>{d["h_proj"]}</h2><div class="row"><span><b>{t}</b> | <i>{r}</i></span></div>{ul(b)}')
    p.append(f'<h2>{d["h_cert"]}</h2>')
    for n, o, dt in d["certs"]:
        p.append(f'<div class="row"><span><b>{n}</b><br>{o}</span><i>{dt}</i></div>')
    p.append(f'<h2>{d["h_train"]}</h2>')
    for n, o, dt in d["train"]:
        p.append(f'<div class="row"><span><b>{n}</b><br>{o}</span><i>{dt}</i></div>')
    p.append(f'<h2>{d["h_ach"]}</h2>')
    for ev, dt, title, b in d["ach"]:
        p.append(f'<div class="ach"><div class="row"><span><b>{ev}</b></span><i>{dt}</i></div><div class="sub">{title}</div>{ul(b)}</div>')
    p.append(f'<h2>{d["h_skill"]}</h2>')
    p.append("<ul>" + "".join(f"<li><b>{k}:</b> {v}</li>" for k, v in d["skills"]) + "</ul>")
    css = """
    @page { size: A4; margin: 15mm 17mm; }
    body { font-family: 'Liberation Serif','Times New Roman',Tinos,serif; font-size: 10.5pt; line-height: 1.32; color:#000; }
    h1 { font-size: 20pt; margin: 0 0 3pt; letter-spacing: .3pt; }
    .contact { font-size: 8.3pt; margin-bottom: 8pt; } .contact a { color:#000; text-decoration:none; }
    .sum { text-align: justify; margin: 0 0 4pt; }
    h2 { font-size: 11.5pt; margin: 11pt 0 3pt; padding-bottom: 1.5pt; border-bottom: 1px solid #1f3864; page-break-after: avoid; }
    .row { display:flex; justify-content: space-between; gap: 12pt; margin-top: 3pt; }
    .row i { white-space: nowrap; }
    .sub { font-style: italic; margin: 1pt 0 1pt; page-break-after: avoid; }
    ul { margin: 2pt 0 3pt; padding-left: 15pt; } li { margin-bottom: 1.5pt; text-align: justify; }
    .ach .row, .ach .sub { page-break-after: avoid; } li { page-break-inside: avoid; }
    """
    return f'<!doctype html><html lang="{d["lang"]}"><head><meta charset="utf-8"><title>Kurniawan Hafiz - CV</title><style>{css}</style></head><body>{"".join(p)}</body></html>'

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page()
        for k, d in D.items():
            pg.set_content(render(d), wait_until="load")
            pg.pdf(path=str(OUT / d["file"]), format="A4", print_background=True, prefer_css_page_size=True,
                   display_header_footer=False)
            print("wrote", OUT / d["file"])
        b.close()
