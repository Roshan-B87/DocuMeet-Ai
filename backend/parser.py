from pypdf import PdfReader
from io import BytesIO


def extract_text_from_file(filename: str, content: bytes) -> str:
    """
    Extract plain text from a PDF or TXT file.
    Returns the extracted text as a string.
    """
    if filename.lower().endswith(".pdf"):
        return _extract_pdf(content)
    elif filename.lower().endswith(".txt"):
        return _extract_txt(content)
    else:
        raise ValueError(f"Unsupported file type: {filename}")


def _extract_pdf(content: bytes) -> str:
    """Extract text from PDF bytes using pypdf (pure Python, no compilation)."""
    reader = PdfReader(BytesIO(content))
    text_parts = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            text_parts.append(text)
    return "\n".join(text_parts).strip()


def _extract_txt(content: bytes) -> str:
    """Extract text from TXT bytes, handling common encodings."""
    for encoding in ("utf-8", "utf-16", "latin-1"):
        try:
            return content.decode(encoding).strip()
        except UnicodeDecodeError:
            continue
    raise ValueError("Could not decode text file with any known encoding.")
