import './markdownGuide.css';

const markdownInfo = [
  ["*bold*", "<strong>bold</strong>"],
  ["_italics_", "<i>italics</i>"],
  ["~strikethrough~", "<strike>strikethrough</strike>"],
  ["`code`", "<code>code</code>"],
  ["```multiline code block```", '<pre>multiline code block</pre>'],
  [">quote", "<blockquote>quote</blockquote>"],
  ["<url|link example>", "<a href=''>link example</a>"],
  ["<!channel>", "<strong>@channel</strong>"],

]

function MarkdownGuide() {
  return (
    <div id="md-guide">
      <h2>Markdown Guide</h2>
      <table className="markdown-guide">
          {markdownInfo.map(info => {
            return (
              <tr>
                <td>{info[0]}</td>
                <td dangerouslySetInnerHTML={{__html: info[1]}}></td>
              </tr>
            )
          })}
      </table>
    </div>
  );
}

export default MarkdownGuide;
