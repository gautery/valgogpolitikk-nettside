import sys, os
from playwright.sync_api import sync_playwright
base, ut = sys.argv[1], sys.argv[2]
proxy = {"server": os.environ["HTTPS_PROXY"]} if base.startswith("https") else None
args = ["--no-sandbox"] + ([] if proxy else ["--no-proxy-server"])
def kjor(s, svar, navn):
    s.goto(f"{base}/grunnkurset-fullfort", wait_until="networkidle")
    assert s.locator("h1").inner_text().startswith("Før du er ferdig"), s.locator("h1").inner_text()
    assert s.locator(".konfetti").count() == 0, "konfetti før quizen er ferdig"
    for i, valg in enumerate(svar):
        assert f"Påstand {i+1} av {len(svar)}" in s.inner_text("body")
        if i == 0 and navn: s.screenshot(path=f"{ut}/{navn}-1-pastand.png", full_page=True)
        s.get_by_role("button", name=valg, exact=True).click()
        fokus = s.evaluate("document.activeElement.innerText")
        ventet = "Riktig. Påstanden er feil." if valg == "Feil" else "Nei, påstanden er feil."
        assert fokus.startswith(ventet), fokus[:60]
        if i == 0 and navn: s.screenshot(path=f"{ut}/{navn}-2-fasit.png", full_page=True)
        siste = i == len(svar) - 1
        s.get_by_role("button", name="Se resultatet" if siste else "Neste påstand").click()
        if not siste:
            assert s.evaluate("document.activeElement.tagName") == "H2"
    s.wait_for_timeout(400)
    fokus = s.evaluate("document.activeElement.innerText")
    if navn: s.screenshot(path=f"{ut}/{navn}-3-resultat.png")
    return fokus, s.locator("h1").inner_text(), s.locator(".konfetti").count(), s.locator("form").count()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=args, proxy=proxy)
    feil = []
    s = b.new_page(viewport={"width": 390, "height": 844}); s.on("pageerror", lambda e: feil.append(str(e)))
    print("5 av 6:", kjor(s, ["Feil","Stemmer","Feil","Feil","Feil","Feil"], "mobil"))
    print("0 av 6:", kjor(s, ["Stemmer"]*6, None))
    print("4 av 6:", kjor(s, ["Feil"]*4 + ["Stemmer"]*2, None)[0][-70:])
    print("3 av 6:", kjor(s, ["Feil"]*3 + ["Stemmer"]*3, None)[0][-70:])
    s.goto(f"{base}/grunnkurset-fullfort", wait_until="networkidle")
    s.get_by_role("button", name="Hopp over quizen").click(); s.wait_for_timeout(300)
    print("hoppet:", s.locator("h1").inner_text(), "| rosa boks:", "sleipe" in s.inner_text("body"), "| konfetti:", s.locator(".konfetti").count())
    # tastatur
    s.goto(f"{base}/grunnkurset-fullfort", wait_until="networkidle")
    s.get_by_role("button", name="Feil", exact=True).focus(); s.keyboard.press("Enter")
    print("tastatur:", s.evaluate("document.activeElement.innerText")[:28])
    d = b.new_page(viewport={"width": 1280, "height": 800}); kjor(d, ["Feil"]*6, "pc")
    print("sidefeil:", feil)
    b.close()
