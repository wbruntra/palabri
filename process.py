import json
from os import walk
import codecs
import string
import glob

# All files and directories ending with .txt and that don't begin with a dot:
# All files and directories ending with .txt with depth of 2 folders, ignoring names beginning with a dot:
# print(glob.glob("/home/adam/*/*.txt"))

filenames = glob.glob("./libros/*.txt")

book = filenames[0]
# print(book)


def process_book(filename):
    with open(filename) as f:
        txt = f.read()
    txt = txt.replace("\n", " ")
    # print(string.punctuation)
    special_punctuation = "—¡¿»«0123456789…"
    txt = txt.translate(str.maketrans("", "", string.punctuation + special_punctuation))
    words = txt.split(" ")
    unique_words = set(words)
    return unique_words
    return list(unique_words)


result = set()

for book in filenames:
    new_words = process_book(book)
    result = result.union(new_words)

# print(list(result)[:200])

six_letter = [w.upper() for w in result if len(w) == 6]
print(six_letter[:100])

with codecs.open("./6-word-list.json", "w", "utf-8") as f:
    f.write(json.dumps(list(six_letter), indent=2))

five_letter = [w.upper() for w in result if len(w) == 5]
print(five_letter[:100])

with codecs.open("./5-word-list.json", "w", "utf-8") as f:
    f.write(json.dumps(list(five_letter), indent=2))
