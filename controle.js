(function() {
	var listaDeAutomatosFinitos = undefined;
	var selecionado = undefined;
	var caixaDeMensagens = undefined;
	var botaoCriarAutomatoFinito = undefined;
	var botaoCriarExpressaoRegular = undefined;
	var botaoAdicionarEstadoDeAutomatoFinito = undefined;
	var textoAdicionarEstadoDeAutomatoFinito = undefined;
	var botaoAdicionarSimboloDeAutomatoFinito = undefined;
	var textoAdicionarSimboloDeAutomatoFinito = undefined;
	var automatoFinito = undefined;
	var temporizadorDaCaixaDeMensagens = undefined;
	var botaoDeterminizarAutomatoFinito = undefined;
	var botaoClonarAutomatoFinito = undefined;
	var botaoMinimizarAutomatoFinito = undefined;
	
	criarAutomatoFinito = function() {
		desabilitarBotoesDoMenuPrincipal();
		desabilitarBotoesDoMenuDeOpcoes();
		var automato = document.createElement("li");
		listaDeAutomatosFinitos.insertBefore(automato, listaDeAutomatosFinitos.firstChild);
		var automatoEditavel = document.createElement("input");
		automatoEditavel.setAttribute("type", "text");
		automatoEditavel.setAttribute("value", "novoAutomato");
		automato.appendChild(automatoEditavel);
		var criar = function() {
			var nomeDoAutomato = automatoEditavel.value;
			if (AutomatosFinitos.criar(nomeDoAutomato)) {
				automato.innerHTML = nomeDoAutomato;
				habilitarBotoesDoMenuPrincipal();
				habilitarBotoesDoMenuDeOpcoes();
				automatoEditavel.onblur = null;
				automatoEditavel.onkeypress = null;
				mostrarMensagem("sucesso", "Autômato finito <strong>" + nomeDoAutomato + "</strong> criado.");
				automato.onclick = function() {
					selecionar(automato);
				};
				selecionar(automato);
			} else {
				mostrarMensagem("erro", "Nome de autômato finito já existente, por favor escolha outro nome.");
				automatoEditavel.select();
			}
		};
		automatoEditavel.onkeypress = function(evento) {
			if (evento.keyCode === 13) {
				criar();
			}
		};
		automatoEditavel.onblur = criar;
		automatoEditavel.select();
	};
	
	mostrarAutomatoFinito = function() {
		var nomeDoAutomatoFinito = obterSelecionado();
		var automatoFinito = AutomatosFinitos.fornecer(nomeDoAutomatoFinito);
		var tabelaDoAutomatoFinito = document.createElement("table");
		var cabecalhoDoAutomatoFinito = mostrarAlfabeto(automatoFinito, nomeDoAutomatoFinito);
		var linhasDosEstados = mostrarEstados(automatoFinito, nomeDoAutomatoFinito);
		var corpoDoAutomatoFinito = mostrarTransicoes(automatoFinito, nomeDoAutomatoFinito, linhasDosEstados);
		tabelaDoAutomatoFinito.appendChild(cabecalhoDoAutomatoFinito);
		tabelaDoAutomatoFinito.appendChild(corpoDoAutomatoFinito);
		mostrarTabela(tabelaDoAutomatoFinito);
	};
	
	mostrarAlfabeto = function(automatoFinito, nomeDoAutomatoFinito) {
		var cabecalhoDoAutomatoFinito = document.createElement("thead");
		var primeiraCelulaDoAutomatoFinito = document.createElement("th");
		var linhaDoAlfabeto = document.createElement("tr");
		primeiraCelulaDoAutomatoFinito.innerHTML = ".·.";
		linhaDoAlfabeto.appendChild(primeiraCelulaDoAutomatoFinito);
		Utilitarios.paraCada(automatoFinito.alfabeto, function(simbolo, chaveDoSimbolo) {
			var colunaDoSimbolo = document.createElement("th");
			colunaDoSimbolo.innerHTML = simbolo;
			linhaDoAlfabeto.appendChild(colunaDoSimbolo);
		});
		cabecalhoDoAutomatoFinito.appendChild(linhaDoAlfabeto);
		return cabecalhoDoAutomatoFinito;
	};
	
	mostrarEstados = function(automatoFinito, nomeDoAutomatoFinto) {
		var linhasDoEstados = {};
		Utilitarios.paraCada(automatoFinito.estados, function(estado, chaveDoEstado) {
			var linhaDoEstado = document.createElement("tr");
			var colunaDoEstado = document.createElement("th");
			var imagemDeEstadoInicial = document.createElement("img");
			var imagemDeEstadoInicialApagado = document.createElement("img");
			var imagemDeEstadoFinal = document.createElement("img");
			var imagemDeEstadoFinalApagado = document.createElement("img");
			colunaDoEstado.innerHTML = estado.toString();
			imagemDeEstadoInicial.setAttribute("class", "estadoInicial");
			imagemDeEstadoInicial.setAttribute("src", "imagens/estadoInicial.png");
			imagemDeEstadoInicialApagado.setAttribute("class", "estadoInicial");
			imagemDeEstadoInicialApagado.setAttribute("src", "imagens/estadoInicialApagado.png");
			imagemDeEstadoFinal.setAttribute("class", "estadoFinal");
			imagemDeEstadoFinal.setAttribute("src", "imagens/estadoFinal.png");
			imagemDeEstadoFinalApagado.setAttribute("class", "estadoFinal");
			imagemDeEstadoFinalApagado.setAttribute("src", "imagens/estadoFinalApagado.png");
			imagemDeEstadoFinal.onclick = function() {
				var sucesso = AutomatosFinitos.removerEstadoFinal(nomeDoAutomatoFinto, chaveDoEstado);
				if (sucesso) {
					mostrarMensagem("informativo", "Desmarcação do estado <strong>" + chaveDoEstado + "</strong> como estado final.");
				}
				mostrarAutomatoFinito();
			};
			imagemDeEstadoFinalApagado.onclick = function() {
				if (AutomatosFinitos.adicionarEstadoFinal(nomeDoAutomatoFinto, chaveDoEstado)) {
					mostrarMensagem("informativo", "Marcação do estado <strong>" + chaveDoEstado + "</strong> como estado final.");	
				} else {
					mostrarMensagem("aviso", "O estado de erro (!) não não pode ser marcado como final.");
				}
				mostrarAutomatoFinito();
			};
			imagemDeEstadoInicialApagado.onclick = function() {
				if (AutomatosFinitos.fixarEstadoInicial(nomeDoAutomatoFinto, chaveDoEstado)) {
					mostrarMensagem("informativo", "Marcação do estado <strong>" + chaveDoEstado + "</strong> como estado inicial.");
				}
				mostrarAutomatoFinito();
			};
			if (estado.final) {
				colunaDoEstado.insertBefore(imagemDeEstadoFinal, colunaDoEstado.firstChild);
			} else {
				colunaDoEstado.insertBefore(imagemDeEstadoFinalApagado, colunaDoEstado.firstChild);
			}
			if (estado.inicial) {
				colunaDoEstado.insertBefore(imagemDeEstadoInicial, colunaDoEstado.firstChild);
			} else {
				colunaDoEstado.insertBefore(imagemDeEstadoInicialApagado, colunaDoEstado.firstChild);
			}
			linhaDoEstado.appendChild(colunaDoEstado);
			linhasDoEstados[chaveDoEstado] = linhaDoEstado;
		});
		return linhasDoEstados;
	};
	
	mostrarTransicoes = function(automatoFinito, nomeDoAutomatoFinito, linhasDosEstados) {
		var corpoDoAutomatoFinito = document.createElement("tbody");
		Utilitarios.paraCada(automatoFinito.estados, function(estado, chaveDoEstado) {
			Utilitarios.paraCada(automatoFinito.alfabeto, function(simbolo, chaveDoSimbolo) {
				var colunaDaTransicao = document.createElement("td");
				var editorDaTransicao = document.createElement("input");
				editorDaTransicao.setAttribute("type", "text");
				editorDaTransicao.setAttribute("class", "transicaoDeAutomatoFinito caixaAlta");
				editorDaTransicao.onblur = function() {
					adicionarTransicaoDeEstadoDeAutomatoFinito(chaveDoEstado, chaveDoSimbolo, editorDaTransicao);
				};
				editorDaTransicao.onkeypress = function(evento) {
					if (evento.keyCode === 13) {
						adicionarTransicaoDeEstadoDeAutomatoFinito(chaveDoEstado, chaveDoSimbolo, editorDaTransicao);
					}
				};
				editorDaTransicao.onclick = function() {
					editorDaTransicao.select();
				};
				editorDaTransicao.setAttribute("value", automatoFinito.transicoes[chaveDoEstado][chaveDoSimbolo].toString());
				colunaDaTransicao.appendChild(editorDaTransicao);
				linhasDosEstados[chaveDoEstado].appendChild(colunaDaTransicao);
			});
			corpoDoAutomatoFinito.appendChild(linhasDosEstados[chaveDoEstado]);
		});
		return corpoDoAutomatoFinito;
	};

	mostrarTabela = function(tabelaDoAutomatoFinito) {
		tabelaDoAutomatoFinito.setAttribute("id", "tabelaDoAutomatoFinitoSelecionado");
		var tabelaAntiga = identificador("tabelaDoAutomatoFinitoSelecionado");
		if (tabelaAntiga !== null) {
			automatoFinito.removeChild(tabelaAntiga);
		}
		automatoFinito.appendChild(tabelaDoAutomatoFinito);
	};

	adicionarEstadoDeAutomatoFinito = function() {
		var texto = textoAdicionarEstadoDeAutomatoFinito.value.toLocaleUpperCase();
		if (AutomatosFinitos.adicionarEstado(obterSelecionado(), texto)) {
			mostrarAutomatoFinito();
			mostrarMensagem("informativo", "Estado <strong>"+texto+"</strong> adicionado.");
		} else {
			mostrarMensagem("aviso", "O estado deve ser uma letra maiúscula que ainda não é um estado.");
		}
		textoAdicionarEstadoDeAutomatoFinito.value = "";
		textoAdicionarEstadoDeAutomatoFinito.focus();
	};

	adicionarSimboloDeAutomatoFinito = function() {
		var texto = textoAdicionarSimboloDeAutomatoFinito.value.toLocaleLowerCase();
		if (AutomatosFinitos.adicionarSimbolo(obterSelecionado(), texto)) {
			mostrarAutomatoFinito();
			mostrarMensagem("informativo", "Símbolo <strong>"+texto+"</strong> adicionado.");
		} else {
			mostrarMensagem("aviso", "O símbolo deve ser uma letra minúscula ou um dígito que ainda não é um símbolo.");
		}
		textoAdicionarSimboloDeAutomatoFinito.value = "";
		textoAdicionarSimboloDeAutomatoFinito.focus();
	};

	adicionarTransicaoDeEstadoDeAutomatoFinito = function(chaveDoEstado, chaveDoSimbolo, editor) {
		var textoDaTransicao = editor.value.toLocaleUpperCase(); 
		var textoDaTransicaoAntiga = editor.getAttribute("value"); 
		if (textoDaTransicao !== textoDaTransicaoAntiga) {
			var estadosDaTransicao = textoDaTransicao.split(/, ?/);
			var sucesso = AutomatosFinitos.fixarTransicao(obterSelecionado(), chaveDoEstado, chaveDoSimbolo, estadosDaTransicao);
			if (!sucesso) {
				mostrarMensagem("aviso", "A transição deve conter apenas estados existentes. As transições do estado de erro (!) não podem ser alteradas. Transições com multiplos estados devem ter estados separados por virgula.");
				editor.value = textoDaTransicaoAntiga;
				editor.setAttribute("value", textoDaTransicaoAntiga);
			} else {
				mostrarMensagem("informativo", "Transição <strong>" + textoDaTransicao + "</strong> alterada.");
				editor.value = textoDaTransicao;
				editor.setAttribute("value", textoDaTransicao);
			}
		}
	};

	determinizarAutomatoFinito = function() {
		var nomeDoAutomato = obterSelecionado();
		var sucesso = AutomatosFinitos.determinizar(nomeDoAutomato);
		if (!sucesso) {
			mostrarMensagem("erro", "Ocorreu um erro na determinização do autômato finito <strong>" + nomeDoAutomato+ "</strong>.");
		} else {
			mostrarMensagem("informativo", "Autômato finito <strong>" + nomeDoAutomato+ "</strong> determinizado.");
		}
		mostrarAutomatoFinito();
	};

	minimizarAutomatoFinito = function() {
		var nomeDoAutomato = obterSelecionado();
		var sucesso = AutomatosFinitos.minimizar(nomeDoAutomato);
		if (!sucesso) {
			mostrarMensagem("erro", "Ocorreu um erro na minimização do autômato finito <strong>" + nomeDoAutomato+ "</strong>. Certifique-se que o automato já foi determinizado.");
		} else {
			mostrarMensagem("informativo", "Autômato finito <strong>" + nomeDoAutomato+ "</strong> minimizado.");
		}
		mostrarAutomatoFinito();
	};

	clonarAutomatoFinito = function() {
		desabilitarBotoesDoMenuPrincipal();
		desabilitarBotoesDoMenuDeOpcoes();
		var automato = document.createElement("li");
		listaDeAutomatosFinitos.insertBefore(automato, listaDeAutomatosFinitos.firstChild);
		var automatoEditavel = document.createElement("input");
		automatoEditavel.setAttribute("type", "text");
		automatoEditavel.setAttribute("value", "automatoClonado");
		automato.appendChild(automatoEditavel);
		var clonar = function() {
			var nomeDoAutomato = automatoEditavel.value;
			if (AutomatosFinitos.clonar(obterSelecionado(), nomeDoAutomato)) {
				automato.innerHTML = nomeDoAutomato;
				habilitarBotoesDoMenuPrincipal();
				habilitarBotoesDoMenuDeOpcoes();
				automatoEditavel.onblur = null;
				automatoEditavel.onkeypress = null;
				mostrarMensagem("sucesso", "Autômato finito <strong>" + nomeDoAutomato + "</strong> clonado.");
				automato.onclick = function() {
					selecionar(automato);
				};
				selecionar(automato);
			} else {
				mostrarMensagem("erro", "Nome de autômato finito já existente, por favor escolha outro nome.");
				automatoEditavel.select();
			}
		};
		automatoEditavel.onkeypress = function(evento) {
			if (evento.keyCode === 13) {
				clonar();
			}
		};
		automatoEditavel.onblur = clonar;
		automatoEditavel.select();
	};

	desabilitarBotoesDoMenuPrincipal = function() {
		botaoCriarAutomatoFinito.setAttribute("disabled", "disabled");
		botaoCriarExpressaoRegular.setAttribute("disabled", "disabled");
	};

	desabilitarBotoesDoMenuDeOpcoes = function() {
		botaoAdicionarEstadoDeAutomatoFinito.setAttribute("disabled", "disabled");
		botaoAdicionarSimboloDeAutomatoFinito.setAttribute("disabled", "disabled");
		botaoDeterminizarAutomatoFinito.setAttribute("disabled", "disabled");
		botaoClonarAutomatoFinito.setAttribute("disabled", "disabled");
		botaoMinimizarAutomatoFinito.setAttribute("disabled", "disabled");

	};

	habilitarBotoesDoMenuPrincipal = function() {
		botaoCriarAutomatoFinito.removeAttribute("disabled");
		botaoCriarExpressaoRegular.removeAttribute("disabled");
	};

	habilitarBotoesDoMenuDeOpcoes = function() {
		botaoAdicionarEstadoDeAutomatoFinito.removeAttribute("disabled");
		botaoAdicionarSimboloDeAutomatoFinito.removeAttribute("disabled");
		botaoDeterminizarAutomatoFinito.removeAttribute("disabled");
		botaoClonarAutomatoFinito.removeAttribute("disabled");
		botaoMinimizarAutomatoFinito.removeAttribute("disabled");
	};
	
	selecionar = function(novoSelecionado) {
		if (selecionado !== undefined) {
			selecionado.setAttribute("class", "");
		}
		selecionado = novoSelecionado;
		selecionado.setAttribute("class", "selecionado");
		mostrarAutomatoFinito();
	};
	
	obterSelecionado = function() {
		if (selecionado !== undefined) {
			return selecionado.innerHTML;
		}
		return "";
	};
	
	mostrarMensagem = function(tipoDeMensagem, mensagem) {
		window.clearTimeout(temporizadorDaCaixaDeMensagens);
		temporizadorDaCaixaDeMensagens = window.setTimeout(limparMensagem, 8000);
		caixaDeMensagens.setAttribute("class", tipoDeMensagem);
		caixaDeMensagens.innerHTML = mensagem;
	};
	
	limparMensagem = function() {
		caixaDeMensagens.setAttribute("class", "");
		window.clearTimeout(temporizadorDaCaixaDeMensagens);
	};
	
	identificador = function(identificador) {
		return document.getElementById(identificador);
	};
	
	adicionarTratadores = function() {
		listaDeAutomatosFinitos = identificador("listaDeAutomatosFinitos");
		caixaDeMensagens = identificador("caixaDeMensagens");
		botaoCriarAutomatoFinito = identificador("botaoCriarAutomatoFinito");
		botaoCriarExpressaoRegular = identificador("botaoCriarExpressaoRegular");
		botaoAdicionarEstadoDeAutomatoFinito = identificador("botaoAdicionarEstadoDeAutomatoFinito");
		textoAdicionarEstadoDeAutomatoFinito = identificador("textoAdicionarEstadoDeAutomatoFinito");
		automatoFinito = identificador("automatoFinito");
		botaoAdicionarSimboloDeAutomatoFinito = identificador("botaoAdicionarSimboloDeAutomatoFinito");
		textoAdicionarSimboloDeAutomatoFinito = identificador("textoAdicionarSimboloDeAutomatoFinito");
		botaoDeterminizarAutomatoFinito = identificador("botaoDeterminizarAutomatoFinito");
		botaoMinimizarAutomatoFinito = identificador("botaoMinimizarAutomatoFinito");
		botaoClonarAutomatoFinito = identificador("botaoClonarAutomatoFinito");
		botaoCriarAutomatoFinito.onclick = criarAutomatoFinito;
		botaoAdicionarEstadoDeAutomatoFinito.onclick = adicionarEstadoDeAutomatoFinito;
		botaoAdicionarSimboloDeAutomatoFinito.onclick = adicionarSimboloDeAutomatoFinito;
		botaoDeterminizarAutomatoFinito.onclick = determinizarAutomatoFinito;
		botaoClonarAutomatoFinito.onclick = clonarAutomatoFinito;
		botaoMinimizarAutomatoFinito.onclick = minimizarAutomatoFinito;
	};
	
	window.onload = adicionarTratadores;
}());