from __future__ import annotations

import os
import unittest
from unittest.mock import patch

import checks


class PullRequestMetadataTests(unittest.TestCase):
    def test_accepts_conventional_commit_title_and_portuguese_summary(self) -> None:
        with patch.dict(
            os.environ,
            {
                "PR_TITLE": "feat: inicia o GH Bot independente",
                "PR_BODY": "## Resumo\nInicializa o produto.",
            },
        ):
            self.assertEqual(checks.pr_metadata(), 0)

    def test_rejects_non_conventional_title(self) -> None:
        with patch.dict(os.environ, {"PR_TITLE": "Bootstrap do bot", "PR_BODY": ""}):
            self.assertEqual(checks.pr_metadata(), 1)

    def test_rejects_english_section_heading(self) -> None:
        with patch.dict(
            os.environ,
            {"PR_TITLE": "docs: atualizar documentação", "PR_BODY": "## Testing\nChecks."},
        ):
            self.assertEqual(checks.pr_metadata(), 1)


if __name__ == "__main__":
    unittest.main()
