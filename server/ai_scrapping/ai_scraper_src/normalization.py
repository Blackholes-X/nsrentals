import hashlib

def normalize_content(content):
    """Normalize content for comparison."""
    # Lowercase, strip whitespace, and remove punctuation (customize as needed)
    content = content.lower().strip()
    return content


def hash_content(content):
    """Hash content to detect duplicates."""
    hasher = hashlib.md5()
    hasher.update(content.encode('utf-8'))
    return hasher.hexdigest()


def merge_contents(contents_in_markdown):
    seen_hashes = set()
    merged_content = ""

    for url, content in contents_in_markdown.items():
        for line in content.splitlines():
            normalized_line = normalize_content(line)
            line_hash = hash_content(normalized_line)
            word_count = len(normalized_line.split())

            # Always include content with 5 or fewer words, otherwise check for duplication
            if word_count <= 4 or line_hash not in seen_hashes:
                seen_hashes.add(line_hash)
                merged_content += line + "\n"

    return merged_content
