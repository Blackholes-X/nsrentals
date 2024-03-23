from bs4 import BeautifulSoup, Comment
import re

def tag_visible(element):
    if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
        return False
    if isinstance(element, Comment):
        return False
    return True

def text_from_html(body):
    soup = BeautifulSoup(body, 'html.parser')
    texts = soup.findAll(text=True)
    visible_texts = filter(tag_visible, texts)
    cleaned_text = u"\n".join(t.strip() for t in visible_texts if t.strip())

    # Replace occurrences of more than two consecutive \n characters with just two \n
    cleaned_text = re.sub(r'\n{3,}', '\n\n\n', cleaned_text)

    return cleaned_text
