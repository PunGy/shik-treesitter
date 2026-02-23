package tree_sitter_shik_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_shik "github.com/tree-sitter/tree-sitter-shik/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_shik.Language())
	if language == nil {
		t.Errorf("Error loading Shik grammar")
	}
}
