# DNS de missaleapp.com antes da mudança para a Vercel

Consulta pública (`dig`) em 2026-10-01, antes de qualquer alteração. Nameservers: Namecheap BasicDNS.

```
; missaleapp.com NS
missaleapp.com.		1800	IN	NS	dns1.registrar-servers.com.
missaleapp.com.		1800	IN	NS	dns2.registrar-servers.com.
; missaleapp.com A
missaleapp.com.		1800	IN	A	192.64.119.241
; missaleapp.com AAAA
; missaleapp.com MX
missaleapp.com.		1800	IN	MX	10 eforward3.registrar-servers.com.
missaleapp.com.		1800	IN	MX	15 eforward4.registrar-servers.com.
missaleapp.com.		1800	IN	MX	20 eforward5.registrar-servers.com.
missaleapp.com.		1800	IN	MX	10 eforward1.registrar-servers.com.
missaleapp.com.		1800	IN	MX	10 eforward2.registrar-servers.com.
; missaleapp.com TXT
missaleapp.com.		1800	IN	TXT	"v=spf1 include:spf.efwd.registrar-servers.com ~all"
; missaleapp.com CAA
; www.missaleapp.com
www.missaleapp.com.	1800	IN	CNAME	parkingpage.namecheap.com.
parkingpage.namecheap.com. 30	IN	CNAME	parking.d.parity.domains.
parking.d.parity.domains. 60	IN	A	2.59.170.19
parking.d.parity.domains. 60	IN	A	104.219.250.36
; _dmarc.missaleapp.com TXT
```

## Mudança planejada (só estes registros)

| Host | Tipo | Antes | Depois |
|---|---|---|---|
| `@` | A (ou URL Redirect) | 192.64.119.241 (estacionamento da Namecheap) | A `216.198.79.1` |
| `www` | CNAME | `parkingpage.namecheap.com.` | `2705bd57fcad7af2.vercel-dns-017.com.` |

MX (`eforward*.registrar-servers.com`) e TXT (SPF do encaminhamento de e-mail) não mudam.
