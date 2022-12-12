
export const keys : any = {
    "# " : ["h1", "heading"],
    "## " : ["h2", "sub heading", "sub-heading"],
    "### " : ["h3", "sub sub heading", "sub-sub-heading"],
    "#### " : ["h4"],
    "##### " : ["h5"],
    "###### " : ["h6"],
    "1. " : ["ordered list", "numbered list", "numbered", "number 1"],
    "- " : ["unordered list", "bullet", "bullet points", "list"],
    "> " : ["blockquote", "quote"],
    "```" : ["code block"],
    "![alt text](image url)" : ["image"],
    "[link text](link url)" : ["link"],
    "****" : ["bold"],
    "**" : ["italic"],
    "~~~~" : ["strikethrough"],
    "\n \n" : ["new line", "next"],
}

const cleanText = (text: string) => {
    // remove all punctuation and spaces
    return text.toLowerCase().replace(/\./g, "").replace(/\s/g, "");
}

export const textToKey = (text: string) => {//
    const clean = cleanText(text);
    const key = Object.keys(keys).find(key => keys[key].find((value: string) => clean.endsWith(value)));
    return key || text
}