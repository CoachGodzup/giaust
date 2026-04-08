.PHONY: serve open test lint clean

PORT := 8000
HOST := localhost

serve:
	python3 -m http.server $(PORT)

open:
	open http://$(HOST):$(PORT)

dev: serve
	@echo "Server running at http://$(HOST):$(PORT)"
	@echo "Run 'make open' to open in browser"

clean:
	rm -rf __pycache__
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
