from bs4 import BeautifulSoup, Comment
import re
import requests
from datetime import datetime

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


def get_html_content(site):
    headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36'
}
    content = requests.get(site, headers=headers).text
    return content

def reorder_dataframe_columns(df, column_order):
    filtered_column_order = [col for col in column_order if col in df.columns]
    return df[filtered_column_order]
def get_today_date_formatted():
    return datetime.now().strftime('%Y-%m-%d')
