import os
from playwright.sync_api import sync_playwright

def run_diagnostics(url):
    print(f"🚀 Пачынаем дыягностыку: {url}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        console_errors = []

        # Слухаем кансоль
        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type in ["error", "warning"] else None)
        
        # ВЫПРАЎЛЕНА: Слухаем правалы сеткавых запытаў
        def handle_request_failed(request):
            error_msg = request.failure if request.failure else "Unknown error"
            console_errors.append(f"[Network Error] {request.method} {request.url} - {error_msg}")
        
        page.on("requestfailed", handle_request_failed)

        try:
            print("🌐 Адкрываем старонку...")
            # Чакаем загрузкі DOM, каб пабачыць памылкі нават калі networkidle не наступіць
            page.goto(url, wait_until="domcontentloaded", timeout=30000)
            
            # Даем 5 секунд на выкананне AJAX-запытаў
            print("⏳ Чакаем выканання запытаў...")
            page.wait_for_timeout(5000)
            
            screenshot_path = "diagnostics_result.png"
            page.screenshot(path=screenshot_path, full_page=True)
            print(f"📸 Скрыншот захаваны: {screenshot_path}")

            if console_errors:
                print("\n❌ ЗНОЙДЗЕНЫЯ ПРАБЛЕМЫ:")
                for err in console_errors:
                    print(f"   - {err}")
            else:
                print("\n✅ Памылак у кансолі браўзера не выяўлена.")

        except Exception as e:
            print(f"⚠️ Памылка падчас тэсту: {e}")
        
        finally:
            browser.close()
            print("\n🏁 Дыягностыка завершана.")

if __name__ == "__main__":
    run_diagnostics("http://localhost:5173/vacancies")