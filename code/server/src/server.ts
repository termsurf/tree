import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	InitializeParams,
	CompletionItem,
	CompletionItemKind,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	InitializeResult
} from 'vscode-languageserver/node';

import * as fs from 'fs';
import * as url from 'url';

import {
	TextDocument
} from 'vscode-languageserver-textdocument';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasWorkspaceFolderCapability = false;

connection.onInitialize((params: InitializeParams) => {
	const capabilities = params.capabilities;

	hasWorkspaceFolderCapability = !!(
		capabilities.workspace && !!capabilities.workspace.workspaceFolders
	);

	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			// Tell the client that this server supports code completion.
			completionProvider: {
				resolveProvider: true,
        triggerCharacters: ['-'],
			}
		}
	};

	if (hasWorkspaceFolderCapability) {
		result.capabilities.workspace = {
			workspaceFolders: {
				supported: true
			}
		};
	}

  documents.all().forEach(captureKeywords);

	return result;
});

// Cache the settings of all open documents
const documentKeywords: Map<string, Array<string>> = new Map();

async function getDocumentKeywords(resource: string): Promise<Array<string>> {
	let result = documentKeywords.get(resource);

  if (!result) {
    result = parseKeywords(await fs.promises.readFile(url.fileURLToPath(resource), 'utf-8'));
		documentKeywords.set(resource, result);
	}

	return result;
}

function parseKeywords(string: string): Array<string> {
  return Object.keys(string.trim().split(/[\n\s]+/)
    .map(x => x.replace(/[^a-z\-]/g, ''))
    .filter(x => x)
    .reduce((m, x) => {
      m[x] = true;
      return m;
    }, {} as Record<string, boolean>));
}

// Only keep settings for open documents
documents.onDidClose(e => {
	documentKeywords.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	captureKeywords(change.document);
});

async function captureKeywords(textDocument: TextDocument): Promise<void> {
	await getDocumentKeywords(textDocument.uri);
}

connection.onDidChangeWatchedFiles(_change => {
	// Monitored files have change in VSCode
	// connection.console.log('We received an file change event');
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
	(_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
    const keywords = documentKeywords.get(_textDocumentPosition.textDocument.uri) ?? [];
		// The pass parameter contains the position of the text document in
		// which code complete got requested. For the example we ignore this
		// info and always provide the same completion items.
    return keywords.map((keyword, i) => ({
      label: keyword,
      kind: CompletionItemKind.Text,
      data: i + 1
    }));
	}
);

connection.onCompletionResolve(
  (item: CompletionItem): CompletionItem => {
    return item;
  }
);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
