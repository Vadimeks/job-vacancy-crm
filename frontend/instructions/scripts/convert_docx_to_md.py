import os
from docx import Document

# --- НАЛАДКА ШЛЯХОЎ ---
# Замяні 'vsim2' на сваё імя карыстальніка Windows, калі яно іншае
DESKTOP_PATH = r"C:\Users\vsim2\OneDrive\Desktop\vac"
OUTPUT_FILE = "../vac-descr.md"

def convert_all_docx_to_single_md():
    # Пераходзім у папку са скрыптом
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    if not os.path.exists(DESKTOP_PATH):
        print(f"❌ Папка не знойдзена: {DESKTOP_PATH}")
        print("Калі ласка, правер шлях у скрыпце (зменная DESKTOP_PATH)")
        return

    # Бярэм усе .docx файлы з гэтай папкі
    files_to_convert = [f for f in os.listdir(DESKTOP_PATH) if f.endswith('.docx')]

    if not files_to_convert:
        print(f"🤷 У папцы '{DESKTOP_PATH}' няма файлаў .docx")
        return

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as md_file:
        md_file.write("# Зборнік апісанняў вакансій (Канвертавана з Працоўнага стала)\n\n")
        
        for file_name in files_to_convert:
            full_path = os.path.join(DESKTOP_PATH, file_name)
            
            print(f"🔄 Апрацоўка: {file_name}...")
            
            try:
                doc = Document(full_path)
                md_file.write(f"## Файл: {file_name}\n\n")
                
                for para in doc.paragraphs:
                    if para.text.strip():
                        md_file.write(f"{para.text}\n\n")
                
                md_file.write("---\n\n")
            except Exception as e:
                print(f"❌ Памылка пры чытанні {file_name}: {e}")

    print(f"✅ Гатова! Апрацавана файлаў: {len(files_to_convert)}")
    print(f"📂 Вынік тут: {os.path.abspath(OUTPUT_FILE)}")

if __name__ == "__main__":
    convert_all_docx_to_single_md()