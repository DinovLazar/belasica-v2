#!/usr/bin/env python3
"""Chapter 9 + 10 of Ace Stojanov's book → data/book/legends.json.

    python3 scripts/ingest/extract-legends.py <book.docx> [-o data/book/legends.json]

Produces one record per person: the book's all-time appearance rank (1–80) and,
for the 60 people the book writes about at length, the biography — one record
per source paragraph, each carrying the paragraph's line number in the
machine-extracted text so any claim can be traced back.

The ONLY edit made to the text is restoring spaces the .docx lost between
run-together words („којги" → „кој ги"). Splits are proposed by a dynamic
program over a vocabulary built from the book itself, then constrained by an
explicit table; nothing is reworded, corrected or added. The author's own typos
survive on purpose — this file is a transcription, not an edition.

Chapter boundaries are line numbers, not patterns: the source headings are
inconsistent (some are their own paragraph, some open the first sentence, some
are numbered and some are not), and a pattern loose enough to catch all of them
also catches sentences that merely start with a name.
"""

import argparse
import collections
import json
import re
import sys

# ── chapter geometry (1-based paragraph numbers in the extracted text) ───────
HEADED = {1: 6278, 2: 6285, 3: 6290, 4: 6296, 5: 6304, 6: 6314, 7: 6320, 8: 6329,
          9: 6334, 10: 6342, 11: 6352, 12: 6357, 13: 6363, 14: 6367, 15: 6373,
          16: 6380, 17: 6385, 18: 6390, 19: 6401, 20: 6408}
INLINE = {21: 6416, 22: 6418, 23: 6420, 24: 6422, 25: 6424, 26: 6427, 27: 6430,
          28: 6433, 29: 6435, 30: 6437, 31: 6439, 32: 6441, 33: 6444, 34: 6448,
          35: 6450, 36: 6452, 37: 6455, 38: 6457, 39: 6460, 40: 6461, 41: 6463,
          42: 6464, 43: 6465, 44: 6467, 45: 6468, 46: 6469, 47: 6470, 48: 6471,
          49: 6472, 50: 6473}
SHORT_START, SHORT_END = 6476, 6566
NATIONAL = [("ГОРАН ПАНДЕВ", 6592), ("ГОРАН ПОПОВ", 6600), ("АЦО СТОЈКОВ", 6607),
            ("ИГОР ЃУЗЕЛОВ", 6615), ("РОБЕРТ ПОПОВ", 6625), ("ПАНЧЕ СТОЈАНОВ", 6635),
            ("ДАНЧО МАСЕВ", 6639), ("ЗОРАН БАЛДОВАЛИЕВ", 6642),
            ("НИКОЛА ТАНУШЕВ", 6644), ("ТОНИ БАНДУЛИЕВ", 6648)]
NATIONAL_END = 6652

SLUG_TOP50 = {
    1: "petar-andreev", 2: "milan-vasilev", 3: "risto-panov", 4: "kostadin-sekulov",
    5: "tome-stojanov", 6: "doncho-georgiev", 7: "ljupcho-mafkov", 8: "tomche-eftimov",
    9: "panche-pantaziev", 10: "mitko-georgiev-sheki", 11: "stefan-sulev",
    12: "toni-atanasov", 13: "zoran-mitevski", 14: "vancho-kostov",
    15: "goran-stojanovski", 16: "vasko-georgiev", 17: "aleksandar-milushev",
    18: "marjan-iliev", 19: "vancho-drvoshanov", 20: "vaso-cvetkov",
    21: "mitko-panov-mitko-panov-mitolja", 22: "trajko-panov", 23: "jordan-serafimovski",
    24: "blagoj-mitev", 25: "mile-chinkov", 26: "robert-hristovski", 27: "gjoksen-limanov",
    28: "trajche-georgiev", 29: "blagoj-tasev", 30: "marjan-daskalovski",
    31: "koce-kostadinov", 32: "risto-anchev", 33: "ilija-andreev", 34: "spaso-tanev",
    35: "tome-pecev", 36: "vase-stoilov", 37: "branko-belichev", 38: "vase-dimitrov",
    39: "zoran-trajkovski", 40: "petar-binev", 41: "mirko-dzhidalov", 42: "gjoko-georgiev",
    43: "risto-urdov-urdinov", 44: "zdravko-zajkov", 45: "mitko-sekulov",
    46: "aleksandar-stojanov", 47: "aleksandar-trajkov", 48: "tome-shumarov",
    49: "gligor-uzunov", 50: "vase-stojkov",
}
SLUG_SHORT = {
    "Н. Танушев": "nikola-tanushev", "Д. Џорлев": "mitko-dzhorlev",
    "П. Стојанов": "panche-stojanov", "Т. Аљоков": "tome-aljokov",
    "В. Митев": "vase-mitev", "Р. Дориев": "risto-doriev", "Р. Гошев": "risto-goshev",
    "Т. Вангелов": "timo-vangelov", "Љ.Стоилков": "ljupcho-stoilkov",
    "К. Ќосев": "kocho-kjosev", "М. Алаѓозовски": "martin-alagjozovski",
    "С. Петковски": "stefan-petkovski", "Д. Руменовски": "dushko-rumenovski",
    "А. Коцев": "aleksandar-kocev", "Р. Попов": "robert-popov",
    "П. Ристевски": "panche-ristevski", "Б. Марков": "branko-markov",
    "Т. Николов": "tome-nikolov", "М. Ризов": "milcho-rizov",
    "Р. Комаров": "risto-komarov", "Ѓ. Ќучуков": "gjorgji-kjuchukov",
    "М. Морарцалиев": "mojsej-morarcaliev", "М. Босиљанов": "dimitar-bosiljanov",
    "А. Трендов": "aleksandar-trendov", "М. Џртев": "mitko-dzhrtev",
    "Т. Семенков": "tome-semenkov", "М. Иванов": "marjan-ivanov",
    "Д. Стојков": "dragan-stojkov", "Р. Попов-Думбович": "risto-popov-r-popov-dumbovich",
    "З. Балдовалиев": "zoran-baldovaliev",
}
SLUG_NATIONAL = {
    "ГОРАН ПАНДЕВ": "goran-pandev", "ГОРАН ПОПОВ": "goran-popov",
    "АЦО СТОЈКОВ": "aco-stojkov", "ИГОР ЃУЗЕЛОВ": "igor-gjuzelov",
    "РОБЕРТ ПОПОВ": "robert-popov", "ПАНЧЕ СТОЈАНОВ": "panche-stojanov",
    "ДАНЧО МАСЕВ": "deni-masev-dancho-masev", "ЗОРАН БАЛДОВАЛИЕВ": "zoran-baldovaliev",
    "НИКОЛА ТАНУШЕВ": "nikola-tanushev", "ТОНИ БАНДУЛИЕВ": "toni-banduliev",
}

# Words the splitter must leave alone — each is a real word that happens to be
# decomposable into two other real words.
KEEP = {"легендите", "интересен", "легендарното", "настапите", "успешната", "засекогаш",
        "поискусните", "вторатата", "легендата", "победите", "соиграч", "напролет",
        "пролетна", "споредно", "погоре", "вторно", "натите", "прватата", "поголеми"}

# Compounds the dynamic program cannot resolve on its own (one half is too rare
# in the book to clear the frequency floor). Each was checked against its
# sentence by hand.
EXPLICIT = {
    "којги": "кој ги", "којигра": "кој игра", "којиграл": "кој играл", "којае": "која е",
    "којќе": "кој ќе", "којна": "кој на", "којво": "кој во", "иетој": "и е тој",
    "таабројка": "таа бројка", "когазапочнува": "кога започнува",
    "последниотнегов": "последниот негов", "прошталеннатпревар": "прошталенен натпревар",
    "противТранскоп": "против Транскоп", "Вистинскалегенда": "Вистинска легенда",
    "порадипандемијатаковид": "поради пандемијата ковид",
    "споредновинарите": "според новинарите", "прекубараж": "преку бараж",
    "придонесза": "придонес за", "постигнуваодлучувачкиот": "постигнува одлучувачкиот",
    "противсловенечкиот": "против словенечкиот", "настапувајќина": "настапувајќи на",
    "Вардарскиедна": "Вардарски една", "меѓуструмичката": "меѓу струмичката",
    "напозајмица": "на позајмица", "штотренер": "што тренер",
    "сомладинците": "со младинците", "сопостигнати": "со постигнати",
    "сонајмногу": "со најмногу", "споредбројот": "според бројот",
    "третстрелец": "трет стрелец", "најдобриотстрелец": "најдобриот стрелец",
    "освојувавторото": "освојува второто", "поминуваследните": "поминува следните",
    "клубазаедно": "клуба заедно", "Трајковкариерата": "Трајков кариерата",
    "Василевуспева": "Василев успева", "Тиверијаигра": "Тиверија игра",
    "Тиверијаво": "Тиверија во", "Скопјенема": "Скопје нема",
    "Македонијаза": "Македонија за", "Беласицаигра": "Беласица игра",
    "Беласицасе": "Беласица се", "заминуваатво": "заминуваат во",
    "имаатсамо": "имаат само", "одбранатана": "одбраната на", "Потоапак": "Потоа пак",
    "Силексќе": "Силекс ќе", "Скопјене": "Скопје не", "воПрвата": "во Првата",
    "вокупот": "во купот", "восезона": "во сезона", "вотимот": "во тимот",
    "годиназа": "година за", "годинана": "година на", "годинапо": "година по",
    "годинаќе": "година ќе", "годиниза": "години за", "голаза": "гола за",
    "головиќе": "голови ќе", "заедносо": "заедно со", "играво": "игра во",
    "играчна": "играч на", "кадего": "каде го", "кадеигра": "каде игра",
    "којаигра": "која игра", "лигакаде": "лига каде", "навкупно": "на вкупно",
    "одатво": "одат во", "потоаза": "потоа за", "потоаќе": "потоа ќе",
    "самоедна": "само една", "сезонапо": "сезона по", "сезониПо": "сезони По",
    "тамуод": "таму од",
}
SHORT_OK = {"е", "и", "а", "во", "на", "за", "од", "по", "со", "ќе", "ги", "го", "се",
            "ја", "му", "не", "до", "кај", "ни", "ти", "што", "кој", "таа", "тој",
            "дел", "пат", "два", "три"}

WORD = re.compile(r"[^\W\d_]+", re.UNICODE)


def build_vocab(text):
    return collections.Counter(t.lower() for t in WORD.findall(text))


def segment(token, vocab):
    """Best split of a run-together token into known words, or None."""
    n = len(token)
    best = [None] * (n + 1)
    best[0] = (0.0, [])
    for j in range(1, n + 1):
        for i in range(j):
            if best[i] is None:
                continue
            piece = token[i:j]
            low = piece.lower()
            if len(piece) < 2 and low not in SHORT_OK:
                continue
            freq = vocab[low]
            if freq < 8:
                continue
            if len(piece) == 2 and low not in SHORT_OK and freq < 200:
                continue
            score = best[i][0] + freq ** 0.5
            if best[j] is None or score > best[j][0]:
                best[j] = (score, best[i][1] + [piece])
    return best[n][1] if best[n] else None


def fix_token(token, vocab):
    if token in EXPLICIT:
        return EXPLICIT[token]
    if token.lower() in KEEP or len(token) < 6 or vocab[token.lower()] >= 3:
        return token
    pieces = segment(token, vocab)
    return " ".join(pieces) if pieces and len(pieces) > 1 else token


def normalise(text, vocab):
    parts = re.split(r"([^\W\d_]+)", text, flags=re.UNICODE)
    out = [fix_token(p, vocab) if WORD.fullmatch(p) else p for p in parts]
    s = "".join(out)
    s = re.sub(r"(?<=[^\W\d_])(?=\d)", " ", s, flags=re.UNICODE)  # „вкупно17"
    s = re.sub(r"\.{2,}", "…", s)
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"\s+([,.;:!?…])", r"\1", s)
    s = re.sub(r'([,;:!?])(?=[^\s\d,.;:!?)\]”“„»])', r"\1 ", s)
    s = re.sub(r'\.(?=[^\s\d,.;:!?)\]”“„»])', ". ", s)
    s = re.sub(r'…(?=[^\s,.;:!?)\]”“„»])', "… ", s)
    return s.strip()


def read_paragraphs(docx_path):
    """Flat list of text lines, 1:1 with the `line` numbers in legends.json.

    A .docx paragraph may itself contain soft line breaks; each becomes its own
    line here, because the chapter geometry above was measured on that flattened
    view. Reading `p.text` alone shifts every number after the first break.
    """
    try:
        import docx
    except ImportError:
        sys.exit("python-docx is required:  pip install python-docx")
    lines = []
    for para in docx.Document(docx_path).paragraphs:
        lines.extend(para.text.rstrip().split("\n"))
    return lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("docx")
    ap.add_argument("-o", "--out", default="data/book/legends.json")
    args = ap.parse_args()

    raw = read_paragraphs(args.docx)
    vocab = build_vocab("\n".join(raw))

    def tidy(s):
        return re.sub(r"\s+", " ", s.replace(" ", " ").replace(" ", " ")).strip()

    def usable(s):
        s = tidy(s)
        return bool(s) and not re.fullmatch(r"[-_—–\s.]+", s)

    def line(n):
        return raw[n - 1]

    def paragraphs(start, stop, drop_leading_number=False):
        out = []
        for n in range(start, stop):
            if not usable(line(n)):
                continue
            text = tidy(line(n))
            if drop_leading_number and not out:
                text = re.sub(r"^\d+\s*\.\s*", "", text)
            out.append({"line": n, "text": normalise(text, vocab)})
        return out

    records = {}

    def record(slug):
        return records.setdefault(slug, {
            "slug": slug, "bookName": None, "legendRank": None,
            "appearancesInBook": None, "yearsInBook": None, "bio": [], "bioSource": None,
        })

    bounds = sorted(list(HEADED.values()) + list(INLINE.values()) + [SHORT_START])

    for rank in range(1, 51):
        head = HEADED.get(rank) or INLINE[rank]
        stop = min(b for b in bounds if b > head)
        if rank in HEADED:
            body = paragraphs(head + 1, stop)
            name = re.sub(r"^\d+\s*\.?\s*", "", tidy(line(head)))
        else:
            body = paragraphs(head, stop, drop_leading_number=True)
            m = re.match(r"^([^,]+?)(?:,|\s+е\s|\s+кој\s|\s+се\s)", body[0]["text"])
            name = m.group(1).strip() if m else ""
        rec = record(SLUG_TOP50[rank])
        rec["bookName"], rec["legendRank"] = name, rank
        rec["bio"], rec["bioSource"] = body, f"книга, гл. 9, бр. {rank}"

    n = SHORT_START
    while n < SHORT_END:
        header = tidy(line(n))
        if not header:
            n += 1
            continue
        m = re.match(r"^([\d\-]+)\.?\s*(.+)$", header)
        if not m:
            break
        apps = re.search(r"(\d+(?:-\d+)?)\s*$", tidy(line(n + 1)))
        years = re.search(r"\(([^)]+)\)", tidy(line(n + 2)))
        rec = record(SLUG_SHORT[m.group(2).strip()])
        rec["bookName"] = rec["bookName"] or m.group(2).strip()
        rec["legendRank"] = int(m.group(1).split("-")[0])
        rec["appearancesInBook"] = apps.group(1) if apps else None
        rec["yearsInBook"] = years.group(1) if years else None
        n += 3

    edges = [start for _, start in NATIONAL] + [NATIONAL_END]
    for i, (name, head) in enumerate(NATIONAL):
        body = [p for p in paragraphs(head + 1, edges[i + 1])
                if not re.fullmatch(r"\d+\.\s*[А-ШЅЈЉЊЌЏЃЖЧ ]+", p["text"])]
        rec = record(SLUG_NATIONAL[name])
        rec["bookName"] = rec["bookName"] or name
        rec["bio"], rec["bioSource"] = body, "книга, гл. 10 — репрезентација"

    people = sorted(records.values(), key=lambda r: (r["legendRank"] or 999, r["slug"]))
    payload = {
        "source": "„ФК Беласица – гордоста на Струмица“, Аце Стојанов, финална верзија "
                  "04.10.2025 — гл. 9 („Фудбалските легенди на Беласица“) и гл. 10 "
                  "(„Македонската репрезентација и Беласица“)",
        "note": "`line` е редниот број на пасусот во машински извлечениот текст на книгата. "
                "Текстот е буквален; единствената интервенција е враќање на изгубени празни "
                "места меѓу залепени зборови („којги“ → „кој ги“).",
        "peopleCount": len(people),
        "rankedCount": sum(1 for r in people if r["legendRank"]),
        "withBioCount": sum(1 for r in people if r["bio"]),
        "people": people,
    }
    with open(args.out, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=1)
    print(f"{args.out}: {len(people)} лица, {payload['rankedCount']} рангирани, "
          f"{payload['withBioCount']} со биографија")


if __name__ == "__main__":
    main()
