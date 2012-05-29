(function() {
	var caixaDeMensagens = undefined;
	var temporizadorDaCaixaDeMensagens = undefined;
	
	var expressaoRegularSelecionada = undefined;
	var containerDeExpressaoRegular = undefined;
	var listaDeExpressoesRegulares = undefined;
	var botaoCriarExpressaoRegular = undefined;
	var botaoSalvarExpressaoRegular = undefined;
	var botaoConverterExpressaoRegularParaAutomatoFinito = undefined;
	var botaoVerificarEquivalenciaComExpressaoRegular = undefined;
	var botaoClonarExpressaoRegular = undefined;
	var textoExpressaoRegular = undefined;
	var expressaoRegularComoTexto = undefined;
	
	var automatoFinitoSelecionado = undefined;
	var containerDeAutomatoFinito = undefined;
	var secaoAutomatoFinito = undefined;
	var listaDeAutomatosFinitos = undefined;
	var botaoCriarAutomatoFinito = undefined;
	var botaoAdicionarEstadoDeAutomatoFinito = undefined;
	var botaoAdicionarSimboloDeAutomatoFinito = undefined;
	var botaoDeterminizarAutomatoFinito = undefined;
	var botaoClonarAutomatoFinito = undefined;
	var botaoMinimizarAutomatoFinito = undefined;
	var botaoReconhecerSentencaDeAutomatoFinito = undefined;
	var botaoEnumerarSentencasDeAutomatoFinito = undefined;
	var textoAdicionarEstadoDeAutomatoFinito = undefined;
	var textoAdicionarSimboloDeAutomatoFinito = undefined;
	var textoSentencaAReconhecer = undefined;
	var textoTamanhoDasSentencasAEnumerar = undefined;
	var resultadoDoReconhecimento = undefined;
	var resultadoDaEnumeracao = undefined;
		
	criarAutomatoFinito = function(evento, funcaoDeCriacao, mensagemDeSucesso, mensagemDeErro, nomePadrao) {
		if (funcaoDeCriacao === undefined) {
			funcaoDeCriacao = function(nomeDoAutomatoFinito) {
				return AutomatosFinitos.criar(nomeDoAutomatoFinito);
			};
			mensagemDeSucesso = "Autômato finito <strong>%nomeDoAutomatoFinito%</strong> criado.";
			mensagemDeErro = "Já existe um autômato finito com o nome <strong>%nomeDoAutomatoFinito%</strong>. Por favor escolha outro nome.";
			nomePadrao = "automatoFinito";
		}
		desabilitarBotoesDoMenuPrincipal();
		desabilitarBotoesDoMenuDeOpcoes();
		var automatoFinitoItemDaLista = document.createElement("li");
		var automatoFinitoCaixaDeTexto = document.createElement("input");
		automatoFinitoCaixaDeTexto.setAttribute("type", "text");
		automatoFinitoCaixaDeTexto.setAttribute("value", nomePadrao);
		automatoFinitoItemDaLista.appendChild(automatoFinitoCaixaDeTexto);
		listaDeAutomatosFinitos.insertBefore(automatoFinitoItemDaLista, listaDeAutomatosFinitos.firstChild);
		var concluirCriacao = function() {
			var nomeDoAutomatoFinito = automatoFinitoCaixaDeTexto.value;
			if (funcaoDeCriacao(nomeDoAutomatoFinito)) {
				automatoFinitoItemDaLista.innerHTML = nomeDoAutomatoFinito;
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
			var automatoFinitoItemDaLista = document.createElement("li");
			automatoFinitoItemDaLista.innerHTML = nomeDoAutomatoFinito;
			automatoFinitoItemDaLista.setAttribute("id", nomeDoAutomatoFinito);
			automatoFinitoItemDaLista.onclick = function() {
				selecionarAutomatoFinito(nomeDoAutomatoFinito);
			};
			listaDeAutomatosFinitos.insertBefore(automatoFinitoItemDaLista, listaDeAutomatosFinitos.firstChild);
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
		textoSentencaAReconhecer.setAttribute("value", "");
		textoSentencaAReconhecer.value = "";
		resultadoDoReconhecimento.innerHTML = "";
		resultadoDaEnumeracao.innerHTML = "";
		mostrarTabelaDoAutomatoFinito(tabelaDoAutomatoFinito);
	};
	
	mostrarAlfabetoDoAutomatoFinito = function (automatoFinito, nomeDoAutomatoFinito) {
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
		}, "Autômato finito <strong>%nomeDoAutomatoFinito%</strong> clonado.", "Já existe um autômato finito com o nome <strong>%nomeDoAutomatoFinito%</strong>. Por favor escolha outro nome.", "automatoClonado");
	};
	
	reconhecerSentencaDeAutomatoFinito = function(evento) {
		var sentenca = textoSentencaAReconhecer.value;
		if (AutomatosFinitos.reconhecerSentenca(obterAutomatoFinitoSelecionado(), sentenca)) {
			if (sentenca.trim() === "") {
				sentenca = "ε";
			}
			resultadoDoReconhecimento.innerHTML = "A sentença <strong>" + sentenca + "</strong> faz parte da linguagem representada pelo autômato finito.";
			resultadoDoReconhecimento.setAttribute("class", "aceita");
		} else {
			if (sentenca.trim() === "") {
				sentenca = "ε";
			}
			resultadoDoReconhecimento.innerHTML = "A sentença <strong>" + sentenca + "</strong> não faz parte da linguagem representada pelo autômato finito.";
			resultadoDoReconhecimento.setAttribute("class", "naoAceita");
		}
	};
	
	enumerarSentencasDeAutomatoFinito = function(evento) {
		resultadoDaEnumeracao.innerHTML = "";
		var tamanhoDasSentencas = parseInt(textoTamanhoDasSentencasAEnumerar.value);
		if (tamanhoDasSentencas.toString() == "NaN") {
			tamanhoDasSentencas = 0;
		}
		textoTamanhoDasSentencasAEnumerar.setAttribute("value", "");
		textoTamanhoDasSentencasAEnumerar.value = "";
		var enumeracoes = AutomatosFinitos.enumerarSentencas(obterAutomatoFinitoSelecionado(), tamanhoDasSentencas);
		Utilitarios.paraCada(enumeracoes, function(enumeracao, indiceDaEnumeracao) {
			if (enumeracao == "") {
				enumeracao = "ε";
			}
			var enumeracaoEmLista = document.createElement("li");
			enumeracaoEmLista.innerHTML = enumeracao;
			resultadoDaEnumeracao.appendChild(enumeracaoEmLista);
		});
		if (enumeracoes.length === 0) {
			var enumeracaoEmLista = document.createElement("li");
			enumeracaoEmLista.innerHTML = "Não existe nenhuma sentença de tamanho " + tamanhoDasSentencas + " pertecente a linguagem.";
			resultadoDaEnumeracao.appendChild(enumeracaoEmLista);
		}
	};
	
	removerAutomatoFinito = function(evento) {
		
	};
	
	criarExpressaoRegular = function(evento, funcaoDeCriacao, mensagemDeSucesso, mensagemDeErro, nomePadrao) {
		if (funcaoDeCriacao === undefined) {
			funcaoDeCriacao = function(nomeDaExpressaoRegular) {
				return ExpressoesRegulares.criar(nomeDaExpressaoRegular);
			};
			mensagemDeSucesso = "Expressão Regular <strong>%nomeDaExpressaoRegular%</strong> criada.";
			mensagemDeErro = "Já existe uma expressão regular com o nome <strong>%nomeDaExpressaoRegular%</strong>. Por favor escolha outro nome.";
			nomePadrao = "expressaoRegular";
		}
		desabilitarBotoesDoMenuPrincipal();
		desabilitarBotoesDoMenuDeOpcoes();
		var expressaoRegularItemDaLista = document.createElement("li");
		var expressaoRegularCaixaDeTexto = document.createElement("input");
		expressaoRegularCaixaDeTexto.setAttribute("type", "text");
		expressaoRegularCaixaDeTexto.setAttribute("value", nomePadrao);
		expressaoRegularItemDaLista.appendChild(expressaoRegularCaixaDeTexto);
		listaDeExpressoesRegulares.insertBefore(expressaoRegularItemDaLista, listaDeExpressoesRegulares.firstChild);
		var concluirCriacao = function() {
			var nomeDaExpressaoRegular = expressaoRegularCaixaDeTexto.value;
			if (funcaoDeCriacao(nomeDaExpressaoRegular)) {
				expressaoRegularItemDaLista.innerHTML = nomeDaExpressaoRegular;
				expressaoRegularCaixaDeTexto.onblur = null;
				expressaoRegularCaixaDeTexto.onkeypress = null;
				mostrarMensagem("sucesso", mensagemDeSucesso.replace("%nomeDaExpressaoRegular%", nomeDaExpressaoRegular));
				mostrarListaDeExpressoesRegulares();
				selecionarExpressaoRegular(nomeDaExpressaoRegular);
				habilitarBotoesDoMenuPrincipal();
				habilitarBotoesDoMenuDeOpcoes();
			} else {
				mostrarMensagem("erro", mensagemDeErro.replace("%nomeDaExpressaoRegular%", nomeDaExpressaoRegular));
				expressaoRegularCaixaDeTexto.select();
			}
		};
		expressaoRegularCaixaDeTexto.onkeypress = function(evento) {
			if (evento.keyCode === 13) {
				concluirCriacao();
			}
		};
		expressaoRegularCaixaDeTexto.onblur = concluirCriacao;
		expressaoRegularCaixaDeTexto.select();
	};
	
	clonarExpressaoRegular = function(evento) {
		criarExpressaoRegular(evento, function(nomeDaExpressaoRegular) {
			return ExpressoesRegulares.clonar(obterExpressaoRegularSelecionada(), nomeDaExpressaoRegular);
		}, "Expressão regular <strong>%nomeDaExpressaoRegular%</strong> clonada.", "Já existe uma expressão regular com o nome <strong>%nomeDaExpressaoRegular%</strong>. Por favor escolha outro nome.", "expressãoClonada");
	};
	
	verificarEquivalenciaDeExpressoesRegulares = function(evento) {
		var nomeDaExpressaoRegularComparada = textoEquivalenciaComExpressaoRegular.value;
		var nomeDaExpressaoRegular = obterExpressaoRegularSelecionada();
		if (ConjuntoDeExpressoesRegulares[nomeDaExpressaoRegularComparada] === undefined) {
			mostrarMensagem("aviso", "A expressão regular <strong>" + nomeDaExpressaoRegularComparada + "</strong> não existe.");
			resultadoEquivalenciaComExpressaoRegular.innerHTML = "";
		} else {
			var saoEquivalentes = ExpressoesRegulares.verificarEquivalencia(nomeDaExpressaoRegular, nomeDaExpressaoRegularComparada);
			if (saoEquivalentes) {
				resultadoEquivalenciaComExpressaoRegular.innerHTML = "As expressões regulares <strong>" + nomeDaExpressaoRegular + "</strong> e <strong>" + nomeDaExpressaoRegularComparada + "</strong> são equivalentes.";
				resultadoEquivalenciaComExpressaoRegular.setAttribute("class", "aceita");
			} else {
				resultadoEquivalenciaComExpressaoRegular.innerHTML = "As expressões regulares <strong>" + nomeDaExpressaoRegular + "</strong> e <strong>" + nomeDaExpressaoRegularComparada + "</strong> não são equivalentes.";
				resultadoEquivalenciaComExpressaoRegular.setAttribute("class", "naoAceita");
			}
		}
	};
	
	removerExpressaoRegular = function(evento) {
		
	};
	
	mostrarListaDeExpressoesRegulares = function() {
		listaDeExpressoesRegulares.innerHTML = "";
		Utilitarios.paraCada(ConjuntoDeExpressoesRegulares, function(expressaoRegular, nomeDaExpressaoRegular) {
			var expressaoRegularItemDaLista = document.createElement("li");
			expressaoRegularItemDaLista.innerHTML = nomeDaExpressaoRegular;
			expressaoRegularItemDaLista.setAttribute("id", nomeDaExpressaoRegular);
			expressaoRegularItemDaLista.onclick = function() {
				selecionarExpressaoRegular(nomeDaExpressaoRegular);
			};
			listaDeExpressoesRegulares.insertBefore(expressaoRegularItemDaLista, listaDeExpressoesRegulares.firstChild);
		});
	};
	
	mostrarExpressaoRegular = function() {
		var nomeDaExpressaoRegular = obterExpressaoRegularSelecionada();
		var expressaoRegular = ConjuntoDeExpressoesRegulares[nomeDaExpressaoRegular];
		textoExpressaoRegular.setAttribute("value", expressaoRegular.expressaoRegularTextual);
		textoExpressaoRegular.value = expressaoRegular.expressaoRegularTextual;
		var expressaoRegularColorida = expressaoRegular.expressaoRegularTextual;
		expressaoRegularColorida = expressaoRegularColorida.replace(/[(]/g, '<span class="parenteses">(</span>');
		expressaoRegularColorida = expressaoRegularColorida.replace(/[)]/g,'<span class="parenteses">)</span>');
		expressaoRegularColorida = expressaoRegularColorida.replace(/[|]/g, '<span class="operadoresBinarios">|</span>');
		expressaoRegularColorida = expressaoRegularColorida.replace(/[.]/g, '<span class="operadoresBinarios">.</span>');
		expressaoRegularColorida = expressaoRegularColorida.replace(/[*]/g, '<sup class="operadoresUnarios">*</sup>');
		expressaoRegularColorida = expressaoRegularColorida.replace(/[+]/g, '<sup class="operadoresUnarios">+</sup>');
		expressaoRegularColorida = expressaoRegularColorida.replace(/[?]/g, '<sup class="operadoresUnarios">\?</sup>');
		expressaoRegularComoTexto.innerHTML = expressaoRegularColorida;
		resultadoEquivalenciaComExpressaoRegular.innerHTML = "";
		textoEquivalenciaComExpressaoRegular.value = "";
	};
	
	salvarExpressaoRegular = function() {
		var nomeDaExpressaoRegular = obterExpressaoRegularSelecionada();
		if (ExpressoesRegulares.salvar(nomeDaExpressaoRegular, textoExpressaoRegular.value)) {
			mostrarMensagem("informativo", "Expressão regular <strong>" + nomeDaExpressaoRegular + "</strong> salva.");
		} else {
			mostrarMensagem("aviso", "A expressão regular deve conter apenas parênteses (()), asteríscos (*), sinal positivo (+), interrogações (?), pontos (.), pipes (|), letras minúsculas e números.");
		}
		mostrarExpressaoRegular();
	};
	
	converterExpressaoRegularParaAutomatoFinito = function(evento) {
		criarAutomatoFinito(evento, function(nomeDoAutomatoFinito) {
			var estadosDoAutomatoConvertido = ExpressoesRegulares.converterParaAutomatoFinito(obterExpressaoRegularSelecionada());
			if (estadosDoAutomatoConvertido !== null && AutomatosFinitos.criar(nomeDoAutomatoFinito)) {
				Utilitarios.paraCada(estadosDoAutomatoConvertido, function(estado, simboloDoEstado) {
					AutomatosFinitos.adicionarEstado(nomeDoAutomatoFinito, simboloDoEstado);
					if (estado.final) {
						AutomatosFinitos.adicionarEstadoFinal(nomeDoAutomatoFinito, simboloDoEstado);
					}
					if (estado.inicial) {
						AutomatosFinitos.fixarEstadoInicial(nomeDoAutomatoFinito, simboloDoEstado);
					}
				});
				Utilitarios.paraCada(estadosDoAutomatoConvertido, function(estado, simboloDoEstado) {
					Utilitarios.paraCada(estado.transicoes, function(transicao, simboloDaTransicao) {
						AutomatosFinitos.adicionarSimbolo(nomeDoAutomatoFinito, simboloDaTransicao);
						AutomatosFinitos.fixarTransicao(nomeDoAutomatoFinito, simboloDoEstado, simboloDaTransicao, [transicao.simbolo]);
					});
				});
				return true;
			} else {
				return false;
			}
		}, "Expressão regular convertida para o autômato finito <strong>%nomeDoAutomatoFinito%</strong>.", "Já existe um autômato finito com o nome <strong>%nomeDoAutomatoFinito%</strong>. Por favor escolha outro nome.", "automatoDeExpressao");
	};
	
	selecionarAutomatoFinito = function(nomeDoAutomatoFinito) {
		containerDeAutomatoFinito.style.display = "block";
		containerDeExpressaoRegular.style.display = "none";
		if (automatoFinitoSelecionado !== undefined) {
			automatoFinitoSelecionado.setAttribute("class", "");
		}
		if (expressaoRegularSelecionada !== undefined) {
			expressaoRegularSelecionada.setAttribute("class", "");
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
		if (automatoFinitoSelecionado !== undefined) {
			automatoFinitoSelecionado.setAttribute("class", "");
		}
		expressaoRegularSelecionada = identificador(nomeDaExpressaoRegular);
		expressaoRegularSelecionada.setAttribute("class", "selecionado");
		mostrarExpressaoRegular();
	};
	
	obterExpressaoRegularSelecionada = function() {
		if (expressaoRegularSelecionada !== undefined) {
			return expressaoRegularSelecionada.innerHTML;
		}
		return "";
	};
	
	
	desabilitarBotoesDoMenuPrincipal = function() {
		botaoCriarExpressaoRegular.setAttribute("disabled", "disabled");
		botaoCriarAutomatoFinito.setAttribute("disabled", "disabled");
	};
	
	desabilitarBotoesDoMenuDeOpcoes = function() {
		botaoAdicionarEstadoDeAutomatoFinito.setAttribute("disabled", "disabled");
		botaoAdicionarSimboloDeAutomatoFinito.setAttribute("disabled", "disabled");
		botaoDeterminizarAutomatoFinito.setAttribute("disabled", "disabled");
		botaoClonarAutomatoFinito.setAttribute("disabled", "disabled");
		botaoMinimizarAutomatoFinito.setAttribute("disabled", "disabled");
		botaoReconhecerSentencaDeAutomatoFinito.setAttribute("disabled", "disabled");
		botaoEnumerarSentencasDeAutomatoFinito.setAttribute("disabled", "disabled");
		botaoSalvarExpressaoRegular.setAttribute("disabled", "disabled");
		botaoConverterExpressaoRegularParaAutomatoFinito.setAttribute("disabled", "disabled");
		botaoVerificarEquivalenciaComExpressaoRegular.setAttribute("disabled", "disabled");
		botaoClonarExpressaoRegular.setAttribute("disabled", "disabled");
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
		botaoReconhecerSentencaDeAutomatoFinito.removeAttribute("disabled");
		botaoEnumerarSentencasDeAutomatoFinito.removeAttribute("disabled");
		botaoSalvarExpressaoRegular.removeAttribute("disabled");
		botaoConverterExpressaoRegularParaAutomatoFinito.removeAttribute("disabled");
		botaoVerificarEquivalenciaComExpressaoRegular.removeAttribute("disabled");
		botaoClonarExpressaoRegular.removeAttribute("disabled");
	};
	
	mostrarMensagem = function(tipoDeMensagem, mensagem) {
		window.clearTimeout(temporizadorDaCaixaDeMensagens);
		temporizadorDaCaixaDeMensagens = window.setTimeout(limparMensagem, 8000);
		caixaDeMensagens.setAttribute("class", tipoDeMensagem);
		caixaDeMensagens.innerHTML = mensagem;
		caixaDeMensagens.scrollIntoView();
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
		botaoSalvarExpressaoRegular = identificador("botaoSalvarExpressaoRegular");
		botaoConverterExpressaoRegularParaAutomatoFinito = identificador("botaoConverterExpressaoRegularParaAutomatoFinito");
		botaoVerificarEquivalenciaComExpressaoRegular = identificador("botaoVerificarEquivalenciaComExpressaoRegular");
		botaoClonarExpressaoRegular = identificador("botaoClonarExpressaoRegular");
		botaoVerificarEquivalenciaComExpressaoRegular = identificador("botaoVerificarEquivalenciaComExpressaoRegular");
		botaoRemoverExpressaoRegular = identificador("botaoRemoverExpressaoRegular");
		textoExpressaoRegular = identificador("textoExpressaoRegular");
		textoEquivalenciaComExpressaoRegular = identificador("textoEquivalenciaComExpressaoRegular");
		expressaoRegularComoTexto = identificador("expressaoRegularComoTexto");
		resultadoEquivalenciaComExpressaoRegular = identificador("resultadoEquivalenciaComExpressaoRegular");
		
		listaDeAutomatosFinitos = identificador("listaDeAutomatosFinitos");
		containerDeAutomatoFinito = identificador("containerDeAutomatoFinito");
		secaoAutomatoFinito = identificador("secaoAutomatoFinito");
		botaoCriarAutomatoFinito = identificador("botaoCriarAutomatoFinito");
		botaoAdicionarEstadoDeAutomatoFinito = identificador("botaoAdicionarEstadoDeAutomatoFinito");
		botaoAdicionarSimboloDeAutomatoFinito = identificador("botaoAdicionarSimboloDeAutomatoFinito");
		botaoDeterminizarAutomatoFinito = identificador("botaoDeterminizarAutomatoFinito");
		botaoMinimizarAutomatoFinito = identificador("botaoMinimizarAutomatoFinito");
		botaoClonarAutomatoFinito = identificador("botaoClonarAutomatoFinito");
		botaoReconhecerSentencaDeAutomatoFinito = identificador("botaoReconhecerSentencaDeAutomatoFinito");
		botaoEnumerarSentencasDeAutomatoFinito = identificador("botaoEnumerarSentencasDeAutomatoFinito");
		botaoRemoverAutomatoFinito = identificador("botaoRemoverAutomatoFinito");
		textoAdicionarEstadoDeAutomatoFinito = identificador("textoAdicionarEstadoDeAutomatoFinito");
		textoAdicionarSimboloDeAutomatoFinito = identificador("textoAdicionarSimboloDeAutomatoFinito");
		textoSentencaAReconhecer = identificador("textoSentencaAReconhecer");
		textoTamanhoDasSentencasAEnumerar = identificador("textoTamanhoDasSentencasAEnumerar");
		resultadoDoReconhecimento = identificador("resultadoDoReconhecimento");
		resultadoDaEnumeracao = identificador("resultadoDaEnumeracao");

		botaoCriarExpressaoRegular.onclick = criarExpressaoRegular;
		botaoSalvarExpressaoRegular.onclick = salvarExpressaoRegular;
		botaoConverterExpressaoRegularParaAutomatoFinito.onclick = converterExpressaoRegularParaAutomatoFinito;
		botaoClonarExpressaoRegular.onclick = clonarExpressaoRegular;
		botaoVerificarEquivalenciaComExpressaoRegular.onclick = verificarEquivalenciaDeExpressoesRegulares;
		botaoRemoverExpressaoRegular.onclick = removerExpressaoRegular;
		
		botaoCriarAutomatoFinito.onclick = criarAutomatoFinito;
		botaoAdicionarEstadoDeAutomatoFinito.onclick = adicionarEstadoDeAutomatoFinito;
		botaoAdicionarSimboloDeAutomatoFinito.onclick = adicionarSimboloDeAutomatoFinito;
		botaoDeterminizarAutomatoFinito.onclick = determinizarAutomatoFinito;
		botaoMinimizarAutomatoFinito.onclick = minimizarAutomatoFinito;
		botaoClonarAutomatoFinito.onclick = clonarAutomatoFinito;
		botaoReconhecerSentencaDeAutomatoFinito.onclick = reconhecerSentencaDeAutomatoFinito;
		botaoEnumerarSentencasDeAutomatoFinito.onclick = enumerarSentencasDeAutomatoFinito;
		botaoRemoverAutomatoFinito.onclick = removerAutomatoFinito;
		
		mostrarListaDeAutomatosFinitos();
		mostrarListaDeExpressoesRegulares();
	};
	
	window.onload = adicionarTratadores;
}());