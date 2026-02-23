import XCTest
import SwiftTreeSitter
import TreeSitterShik

final class TreeSitterShikTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_shik())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Shik grammar")
    }
}
