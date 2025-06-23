import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PdfViewer from "@/components/app/dashboard/pdf-viewer";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

// Placeholder markdown content with LaTeX examples
const placeholderMarkdown = `# Complete Markdown & LaTeX Reference

This document demonstrates all possible markdown elements with LaTeX support.

## Text Formatting

### Basic Text Styles

**Bold text** and *italic text* can be combined for ***bold italic***.

You can also use ~~strikethrough~~ text.

### Inline Code

Use \`inline code\` for short code snippets or \`variable names\`.

## Headers

# H1 Header
## H2 Header  
### H3 Header
#### H4 Header
##### H5 Header
###### H6 Header

## Lists

### Unordered Lists

- First item
- Second item
  - Nested item
  - Another nested item
- Third item
  - Deeply nested
    - Even deeper

### Ordered Lists

1. First numbered item
2. Second numbered item
   1. Nested numbered item
   2. Another nested item
3. Third numbered item

### Mixed Lists

1. Numbered item
   - Bullet point
   - Another bullet
2. Another numbered item
   - More bullets
     1. Nested numbered
     2. Another nested

## Links and References

### Basic Links

[Google](https://www.google.com)
[GitHub](https://github.com)

### Links with Titles

[Stack Overflow](https://stackoverflow.com "Programming Q&A Site")

### Reference Links

[Markdown Guide][markdown-guide]

[markdown-guide]: https://www.markdownguide.org "Complete Markdown Reference"

## Images

![Alt text for image](https://via.placeholder.com/300x200 "Image title")

### Reference Images

![Another image][placeholder-img]

[placeholder-img]: https://via.placeholder.com/400x300 "Placeholder image"

## Code Blocks

### Basic Code Block

\`\`\`javascript
function helloWorld() {
  console.log("Hello, World!");
  return "Hello from JavaScript!";
}
\`\`\`

### Code Block with Language

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Calculate first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
\`\`\`

### Inline Code in Lists

- Use \`npm install\` to install packages
- Run \`npm start\` to start development server
- Use \`git commit -m "message"\` for commits

## Blockquotes

> This is a simple blockquote.
> 
> It can span multiple lines.

### Nested Blockquotes

> First level quote
> > Second level quote
> > > Third level quote

### Blockquotes with Other Elements

> **Bold text in quote**
> 
> - List item in quote
> - Another list item
> 
> \`code in quote\`

## Tables

### Basic Table

| Name | Age | Occupation |
|------|-----|------------|
| John | 25  | Developer  |
| Jane | 30  | Designer   |
| Bob  | 35  | Manager    |

### Aligned Table

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left         | Center         | Right         |
| Data         | Data           | Data          |

### Complex Table

| Feature | Markdown | LaTeX | Support |
|---------|----------|-------|---------|
| **Bold** | \`**text**\` | \`\\textbf{text}\` | ✅ |
| *Italic* | \`*text*\` | \`\\textit{text}\` | ✅ |
| Math | \`$x^2$\` | \`$x^2$\` | ✅ |

## Horizontal Rules

---

Above is a horizontal rule.

***

Another horizontal rule.

___

And another one.

## LaTeX Mathematics

### Inline Math

The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$.

The derivative of $f(x) = x^2$ is $f'(x) = 2x$.

### Block Math

The Pythagorean theorem states:

$$a^2 + b^2 = c^2$$

The Euler's identity:

$$e^{i\\pi} + 1 = 0$$

### Complex Mathematical Expressions

#### Matrix Operations

For a matrix $A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$, the determinant is:

$$\\det(A) = \\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc$$

#### Summation and Products

The sum of the first $n$ natural numbers:

$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$

The factorial of $n$:

$$n! = \\prod_{i=1}^{n} i$$

#### Integrals and Derivatives

The indefinite integral:

$$\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$$

The definite integral:

$$\\int_{0}^{1} x^2 dx = \\left[\\frac{x^3}{3}\\right]_{0}^{1} = \\frac{1}{3}$$

#### Greek Letters and Symbols

Common Greek letters: $\\alpha, \\beta, \\gamma, \\delta, \\epsilon, \\theta, \\lambda, \\mu, \\pi, \\sigma, \\phi, \\psi, \\omega$

Uppercase: $\\Alpha, \\Beta, \\Gamma, \\Delta, \\Theta, \\Lambda, \\Pi, \\Sigma, \\Phi, \\Psi, \\Omega$

#### Subscripts and Superscripts

Chemical formula: $H_2O$ and $CO_2$

Mathematical expressions: $x^2 + y^2 = z^2$

Complex: $e^{i\\theta} = \\cos(\\theta) + i\\sin(\\theta)$

#### Fractions and Roots

Simple fraction: $\\frac{1}{2}$

Complex fraction: $\\frac{a + b}{c + d}$

Nested fractions: $\\frac{1}{1 + \\frac{1}{1 + \\frac{1}{1 + x}}}$

Square root: $\\sqrt{x}$

Nth root: $\\sqrt[n]{x}$

#### Limits and Series

Limit: $\\lim_{x \\to \\infty} \\frac{1}{x} = 0$

Infinite series: $\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}$

#### Set Theory

Set notation: $A = \\{1, 2, 3, 4, 5\\}$

Set operations: $A \\cup B$, $A \\cap B$, $A \\setminus B$

Subset: $A \\subseteq B$

Element of: $x \\in A$

#### Logic and Proofs

Logical operators: $\\land$ (and), $\\lor$ (or), $\\neg$ (not), $\\implies$ (implies), $\\iff$ (iff)

Quantifiers: $\\forall x$ (for all), $\\exists x$ (there exists)

## Task Lists

- [x] Completed task
- [ ] Pending task
- [x] Another completed task
- [ ] Another pending task

## Escaping Characters

To display literal asterisks: \\*not bold\\*

To display literal backticks: \\\`not code\\\`

To display literal brackets: \\[not a link\\]

## Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.

## Definition Lists

Term 1
: Definition 1

Term 2
: Definition 2
: Another definition for term 2

## Abbreviations

*[HTML]: HyperText Markup Language
*[CSS]: Cascading Style Sheets

The HTML and CSS are fundamental web technologies.

---

## Conclusion

This demonstrates all major markdown elements with comprehensive LaTeX support. You can now see how your content will render when fetched from your database.

> **Note**: All LaTeX expressions are properly rendered using KaTeX, and the styling is consistent with your application's theme.`;

export default async function LecturePage() {
  return (
    <div className="mx-auto mt-2 flex w-full flex-col">
      <div className="h-[calc(100vh-7rem)] rounded-lg">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="pr-6">
            <PdfViewer fileUrl="/Week 9.pdf" />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className="pl-6">
            <Tabs defaultValue="explanation">
              <TabsList className="w-full">
                <TabsTrigger
                  value="explanation"
                  className="hover:cursor-pointer"
                >
                  Explanation
                </TabsTrigger>
                <TabsTrigger value="summary" className="hover:cursor-pointer">
                  Summary
                </TabsTrigger>
                <TabsTrigger value="notes" className="hover:cursor-pointer">
                  Notes
                </TabsTrigger>
              </TabsList>
              <TabsContent value="explanation">
                Make changes to your explanation here.
              </TabsContent>
              <TabsContent value="summary" className="markdown-content">
                <div className="border-border mt-3 max-h-[calc(100vh-10.5rem)] w-full overflow-y-auto rounded-lg border p-4 lg:p-8">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {placeholderMarkdown}
                  </ReactMarkdown>
                </div>
              </TabsContent>
              <TabsContent value="notes">Change your notes here.</TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
