(function() {
	var caixaDeMensagens = undefined;
	var temporizadorDaCaixaDeMensagens = undefined;
	
	var containerDeExpressaoRegular = undefined;
	var listaDeExpressoesRegulares = undefined;
	var botaoCriarExpressaoRegular = undefined;
	
	var automatoFinitoSelecionado = undefined;
	var containerDeAutomatoFinito = undefined;
	var secaoAutomatoFinito = undefined;
	var listaDeAutomatosFinitos = undefined;
	var botaoCriarAutomatoFinito = undefined;
	var botaoAdicionarEstadoDeAutomatoFinito = undefined;
	var textoAdicionarEstadoDeAutomatoFinito = undefined;
	var botaoAdicionarSimboloDeAutomatoFinito = undefined;
	var textoAdicionarSimboloDeAutomatoFinito = undefined;
	var botaoDeterminizarAutomatoFinito = undefined;
	var botaoClonarAutomatoFinito = undefined;
	var botaoMinimizarAutomatoFinito = undefined;
	
	criarAutomatoFinito = function(evento, funcaoDeCriacao, mensagemDeSucesso, mensagemDeErro, nomePadrao) {
		if (funcaoDeCriacao === undefined) {
			funcaoDeCriacao = function(nomeDoAutomatoFinito) {
				return AutomatosFinitos.criar(nomeDoAutomatoFinito);
			};
			mensagemDeSucesso = "Autômato finito <strong>%nomeDoAutomatoFinito%</strong> criado.";
			mensagemDeErro = "Já existe um automato finito com o nome <strong>%nomeDoAutomatoFinito%</strong>. Por favor escolha outro nome.";
			nomePadrao = "automatoFinito";
		}
		desabilitarBotoesDoMenuPrincipal();
		desabilitarBotoesDoMenuDeOpcoes();
		var automatoItemDaLista = document.createElement("li");
		var automatoFinitoCaixaDeTexto = document.createElement("input");
		automatoFinitoCaixaDeTexto.setAttribute("type", "text");
		automatoFinitoCaixaDeTexto.setAttribute("value", nomePadrao);
		automatoItemDaLista.appendChild(automatoFinitoCaixaDeTexto);
		listaDeAutomatosFinitos.insertBefore(automatoItemDaLista, listaDeAutomatosFinitos.firstChild);
		var concluirCriacao = function() {
			var nomeDoAutomatoFinito = automatoFinitoCaixaDeTexto.value;
			if (funcaoDeCriacao(nomeDoAutomatoFinito)) {
				automatoItemDaLista.innerHTML = nomeDoAutomatoFinito;
				automatoFinitoCaixaDeTexto.onblur = null;
				automatoFinitoCaixaDeTexto.onkeypress = null;
				mostrarMensagem("sucesso", mensagemDeSucesso.replace("%nomeDoAutomatoFinito%", nomeDoAutomatoFinito));
				mostrarListaDeAutomatosFinitos();
				selecionarAutomatoFinito(nomeDoAutomatoFinito);
				habilitarBotoesDoMenuPrincipal();
				habilitarBotoesDoMenuDeOpcoes();
			} else {
				mostrarMensagem("erro", mensagemDeErro.replace("%nomeDoAutomatoFinito%", nomeDoAutomatoFinito));
				automatoFinitoCaixaDeTexto.select();
			}
		};
		automatoFinitoCaixaDeTexto.onkeypress = function(evento) {
			if (evento.keyCode === 13) {
				concluirCriacao();
			}
		};
		automatoFinitoCaixaDeTexto.onblur = concluirCriacao;
		automatoFinitoCaixaDeTexto.select();
	};
	
	mostrarListaDeAutomatosFinitos = function() {
		listaDeAutomatosFinitos.innerHTML = "";
		Utilitarios.paraCada(ConjuntoDeAutomatosFinitos, function(automatoFinito, nomeDoAutomatoFinito) {
			var automatoItemDaLista = document.createElement("li");
			automatoItemDaLista.innerHTML = nomeDoAutomatoFinito;
			automatoItemDaLista.setAttribute("id", nomeDoAutomatoFinito);
			automatoItemDaLista.onclick = function() {
				selecionarAutomatoFinito(nomeDoAutomatoFinito);
			};
			listaDeAutomatosFinitos.insertBefore(automatoItemDaLista, listaDeAutomatosFinitos.firstChild);
		});
	};
	
	mostrarAutomatoFinito = function() {
		var nomeDoAutomatoFinito = obterAutomatoFinitoSelecionado();
		var automatoFinito = ConjuntoDeAutomatosFinitos[nomeDoAutomatoFinito];
		var tabelaDoAutomatoFinito = document.createElement("table");
		var cabecalhoDoAutomatoFinito = mostrarAlfabetoDoAutomatoFinito(automatoFinito, nomeDoAutomatoFinito);
		var linhasDosEstadosDoAutomatoFinito = mostrarEstadosDoAutomatoFinito(automatoFinito, nomeDoAutomatoFinito);
		var corpoDoAutomatoFinito = mostrarTransicoesDeEstadoDoAutomatoFinito(automatoFinito, nomeDoAutomatoFinito, linhasDosEstadosDoAutomatoFinito);
		tabelaDoAutomatoFinito.appendChild(cabecalhoDoAutomatoFinito);
		tabelaDoAutomatoFinito.appendChild(corpoDoAutomatoFinito);
		mostrarTabelaDoAutomatoFinito(tabelaDoAutomatoFinito);
	};
	
	mostrarAlfabetoDoAutomatoFinito = function(automatoFinito, nomeDoAutomatoFinito) {
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
	
	mostrarEstadosDoAutomatoFinito = function(automatoFinito, nomeDoAutomatoFinto) {
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
	
	mostrarTransicoesDeEstadoDoAutomatoFinito = function(automatoFinito, nomeDoAutomatoFinito, linhasDosEstados) {
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

	mostrarTabelaDoAutomatoFinito = function(tabelaDoAutomatoFinito) {
		tabelaDoAutomatoFinito.setAttribute("id", "tabelaDoAutomatoFinitoSelecionado");
		var tabelaAntiga = identificador("tabelaDoAutomatoFinitoSelecionado");
		if (tabelaAntiga !== null && tabelaAntiga !== undefined) {
			secaoAutomatoFinito.removeChild(tabelaAntiga);
		}
		secaoAutomatoFinito.appendChild(tabelaDoAutomatoFinito);
	};

	adicionarEstadoDeAutomatoFinito = function() {
		var texto = textoAdicionarEstadoDeAutomatoFinito.value.toLocaleUpperCase();
		if (AutomatosFinitos.adicionarEstado(obterAutomatoFinitoSelecionado(), texto)) {
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
		if (AutomatosFinitos.adicionarSimbolo(obterAutomatoFinitoSelecionado(), texto)) {
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
			var sucesso = AutomatosFinitos.fixarTransicao(obterAutomatoFinitoSelecionado(), chaveDoEstado, chaveDoSimbolo, estadosDaTransicao);
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
		var nomeDoAutomato = obterAutomatoFinitoSelecionado();
		var sucesso = AutomatosFinitos.determinizar(nomeDoAutomato);
		if (!sucesso) {
			mostrarMensagem("erro", "Ocorreu um erro na determinização do autômato finito <strong>" + nomeDoAutomato+ "</strong>.");
		} else {
			mostrarMensagem("informativo", "Autômato finito <strong>" + nomeDoAutomato+ "</strong> determinizado.");
		}
		mostrarAutomatoFinito();
	};

	minimizarAutomatoFinito = function() {
		var nomeDoAutomato = obterAutomatoFinitoSelecionado();
		var sucesso = AutomatosFinitos.minimizar(nomeDoAutomato);
		if (!sucesso) {
			mostrarMensagem("erro", "Ocorreu um erro na minimização do autômato finito <strong>" + nomeDoAutomato+ "</strong>. Certifique-se que o automato já foi determinizado.");
		} else {
			mostrarMensagem("informativo", "Autômato finito <strong>" + nomeDoAutomato+ "</strong> minimizado.");
		}
		mostrarAutomatoFinito();
	};

	clonarAutomatoFinito = function(evento) {
		criarAutomatoFinito(evento, function(nomeDoAutomatoFinito) {
			return AutomatosFinitos.clonar(obterAutomatoFinitoSelecionado(), nomeDoAutomatoFinito);
		}, "Autômato finito <strong>%nomeDoAutomatoFinito%</strong> clonado.", "Já existe um automato finito com o nome <strong>%nomeDoAutomatoFinito%</strong>. Por favor escolha outro nome.", "automatoClonado");
	};
	
	mostarExpressaoRegular = function() {
		
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
	
	selecionarAutomatoFinito = function(nomeDoAutomatoFinito) {
		containerDeAutomatoFinito.style.display = "block";
		containerDeExpressaoRegular.style.display = "none";
		if (automatoFinitoSelecionado !== undefined) {
			automatoFinitoSelecionado.setAttribute("class", "");
		}
		automatoFinitoSelecionado = identificador(nomeDoAutomatoFinito);
		automatoFinitoSelecionado.setAttribute("class", "selecionado");
		mostrarAutomatoFinito();
	};
	
	obterAutomatoFinitoSelecionado = function() {
		if (automatoFinitoSelecionado !== undefined) {
			return automatoFinitoSelecionado.innerHTML;
		}
		return "";
	};
	
	selecionarExpressaoRegular = function(nomeDaExpressaoRegular) {
		containerDeExpressaoRegular.style.display = "block";
		containerDeAutomatoFinito.style.display = "none";
		if (expressaoRegularSelecionada !== undefined) {
			expressaoRegularSelecionada.setAttribute("class", "");
		}
		expressaoRegularSelecionada = identificador(nomeDoAutomatoFinito);
		expressaoRegularSelecionada.setAttribute("class", "selecionado");
		mostrarExpressaoRegular();
	};
	
	obterExpressaoRegularSelecionadaFinitoSelecionado = function() {
		if (expressaoRegularSelecionada !== undefined) {
			return expressaoRegularSelecionada.innerHTML;
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
		caixaDeMensagens = identificador("caixaDeMensagens");
		
		listaDeExpressoesRegulares = identificador("listaDeExpressoesRegulares");
		containerDeExpressaoRegular = identificador("containerDeExpressaoRegular");
		botaoCriarExpressaoRegular = identificador("botaoCriarExpressaoRegular");
		
		listaDeAutomatosFinitos = identificador("listaDeAutomatosFinitos");
		containerDeAutomatoFinito = identificador("containerDeAutomatoFinito");
		secaoAutomatoFinito = identificador("secaoAutomatoFinito");
		botaoCriarAutomatoFinito = identificador("botaoCriarAutomatoFinito");
		botaoAdicionarEstadoDeAutomatoFinito = identificador("botaoAdicionarEstadoDeAutomatoFinito");
		botaoAdicionarSimboloDeAutomatoFinito = identificador("botaoAdicionarSimboloDeAutomatoFinito");
		botaoDeterminizarAutomatoFinito = identificador("botaoDeterminizarAutomatoFinito");
		botaoMinimizarAutomatoFinito = identificador("botaoMinimizarAutomatoFinito");
		botaoClonarAutomatoFinito = identificador("botaoClonarAutomatoFinito");
		textoAdicionarEstadoDeAutomatoFinito = identificador("textoAdicionarEstadoDeAutomatoFinito");
		textoAdicionarSimboloDeAutomatoFinito = identificador("textoAdicionarSimboloDeAutomatoFinito");
		
		botaoCriarAutomatoFinito.onclick = criarAutomatoFinito;
		botaoAdicionarEstadoDeAutomatoFinito.onclick = adicionarEstadoDeAutomatoFinito;
		botaoAdicionarSimboloDeAutomatoFinito.onclick = adicionarSimboloDeAutomatoFinito;
		botaoDeterminizarAutomatoFinito.onclick = determinizarAutomatoFinito;
		botaoClonarAutomatoFinito.onclick = clonarAutomatoFinito;
		botaoMinimizarAutomatoFinito.onclick = minimizarAutomatoFinito;
	};
	
	window.onload = adicionarTratadores;
}());