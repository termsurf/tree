import { LinkName } from './form.js';
export function showMesh(base) {
    const text = [''];
    showMeshDetails(base).forEach(line => {
        text.push(`${line}`);
    });
    text.push('');
    return text.join('\n');
}
export function showParserMesh(base) {
    const text = [''];
    showParserMeshDetails(base).forEach(line => {
        text.push(`  ${line}`);
    });
    text.push('');
    return text.join('\n');
}
function showMeshDetails(node, flat = false) {
    const text = [];
    switch (node.form) {
        case LinkName.TextLine: {
            text.push(node.bond);
            break;
        }
        case LinkName.Tree: {
            const head = [];
            if (node.head) {
                showMeshDetails(node.head, flat).forEach(line => {
                    head.push(`${line}`);
                });
            }
            const nest = [];
            node.nest.forEach(el => {
                showMeshDetails(el, flat).forEach(line => {
                    nest.push(`${line}`);
                });
            });
            if (flat) {
                text.push(`${head.join('')}(${nest.join(', ')})`);
            }
            else {
                text.push(`${head.join('')}`);
                nest.forEach(line => {
                    text.push(`  ${line}`);
                });
            }
            break;
        }
        case LinkName.Size: {
            text.push(chalk.green(`${node.bond}`));
            break;
        }
        case LinkName.Text: {
            const string = [];
            node.list.forEach(seg => {
                showMeshDetails(seg, true).forEach(line => {
                    string.push(`${line}`);
                });
            });
            text.push(`<${string.join('')}>`);
            break;
        }
        case LinkName.Nick: {
            if (node.nest.length) {
                const plugin = [];
                node.nest.forEach(nest => {
                    showMeshDetails(nest, true).forEach(line => {
                        plugin.push(`${line}`);
                    });
                });
                text.push('{'.repeat(node.size) +
                    plugin.join('') +
                    '}'.repeat(node.size));
            }
            break;
        }
        case LinkName.Cull: {
            const slot = [];
            node.nest.forEach(nest => {
                showMeshDetails(nest, true).forEach(line => {
                    slot.push(`${line}`);
                });
            });
            text.push('[' + slot.join('') + ']');
            break;
        }
        case LinkName.Comb: {
            text.push(`${node.bond}`);
            break;
        }
        case LinkName.Code: {
            text.push(`#${node.base}${node.bond}`);
            break;
        }
        case LinkName.Term: {
            const term = [];
            node.list.forEach(seg => {
                showMeshDetails(seg, true).forEach(line => {
                    term.push(line);
                });
            });
            text.push(term.join(''));
            break;
        }
        case LinkName.Line: {
            const line = [];
            node.list.forEach((seg, i) => {
                showMeshDetails(seg, true).forEach(line => {
                    if (i > 0 && seg.form !== LinkName.Cull) {
                        line.push('/');
                    }
                    line.push(line);
                });
            });
            text.push(line.join(''));
            break;
        }
        default:
            throw haltNotImplemented(undefined);
    }
    return text;
}
function showParserMeshDetails(node) {
    const text = [];
    const title = chalk.white(node.form);
    switch (node.form) {
        case LinkName.Text: {
            text.push(`${title} ${chalk.green(node.bond)}`);
            break;
        }
        case LinkName.Tree: {
            text.push(`${title}`);
            if (node.head) {
                text.push(chalk.gray(`  head:`));
                showParserMeshDetails(node.head).forEach(line => {
                    text.push(`    ${line}`);
                });
            }
            else {
                text.push(chalk.gray('  hook: undefined'));
            }
            if (node.nest.length) {
                text.push(chalk.gray(`  nest:`));
                node.nest.forEach(el => {
                    showParserMeshDetails(el).forEach(line => {
                        text.push(`    ${line}`);
                    });
                });
            }
            break;
        }
        case LinkName.Size: {
            text.push(`${title} ${node.bond}`);
            break;
        }
        case LinkName.Text: {
            text.push(`${title}`);
            node.list.forEach(seg => {
                showParserMeshDetails(seg).forEach(line => {
                    text.push(`  ${line}`);
                });
            });
            break;
        }
        case LinkName.Nick: {
            text.push(`${title}`);
            text.push(chalk.gray(`  size: ${node.size}`));
            if (node.nest.length) {
                text.push(chalk.gray(`  nest:`));
                node.nest.forEach(nest => {
                    showParserMeshDetails(nest).forEach(line => {
                        text.push(`    ${line}`);
                    });
                });
            }
            break;
        }
        case LinkName.Cull: {
            text.push(`${title}`);
            text.push(chalk.gray(`  nest:`));
            node.nest.forEach(nest => {
                showParserMeshDetails(nest).forEach(line => {
                    text.push(`    ${line}`);
                });
            });
            break;
        }
        case LinkName.Comb: {
            text.push(`${title} ${node.bond}`);
            break;
        }
        case LinkName.Code: {
            text.push(`${title} #${node.system}${node.code}`);
            break;
        }
        case LinkName.Term: {
            text.push(`${title}`);
            node.list.forEach(seg => {
                showParserMeshDetails(seg).forEach(line => {
                    text.push(`  ${line}`);
                });
            });
            break;
        }
        case LinkName.Line: {
            text.push(`${title}`);
            node.list.forEach(seg => {
                showParserMeshDetails(seg).forEach(line => {
                    text.push(`  ${line}`);
                });
            });
            break;
        }
        default:
            throw haltNotImplemented(undefined);
    }
    return text;
}
//# sourceMappingURL=show.js.map