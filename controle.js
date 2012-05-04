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
	var automatoFinitoExpressaoRegular = undefined;
	var temporizadorDaCaixaDeMensagens = undefined;
	
	criarAutomatoFinito = function() {
		desabilitarBotoesDoMenuPrincipal();
		var automato = document.createElement("li");
		listaDeAutomatosFinitos.insertBefore(automato, listaDeAutomatosFinitos.firstChild);
		var automatoEditavel = document.createElement("input");
		automatoEditavel.setAttribute("type", "text");
		automatoEditavel.setAttribute("value", "novoAutomato");
		automato.appendChild(automatoEditavel);
		var criar = function() {
			var nomeDoAutomato = automatoEditavel.value;
			if (Regulares.criarAutomatoFinito(nomeDoAutomato)) {
				automato.innerHTML = nomeDoAutomato;
				habilitarBotoesDoMenuPrincipal();
				automatoEditavel.onblur = null;
				automatoEditavel.onkeypress = null;
				mostrarMensagem("sucesso", "Automato criado com sucesso.");
				automato.onclick = function() {
					selecionar(automato);
				};
				selecionar(automato);
			} else {
				mostrarMensagem("erro", "Nome já existente, por favor escolha outro nome.");
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
		var nome = obterSelecionado();
		var automatoFinito = Regulares.fornecerAutomatoFinito(nome);
		var tabela = document.createElement("table");
		var cabecalho = document.createElement("thead");
		var linhaDeCabecalho = document.createElement("tr");
		var linhasDoCorpo = [];
		var corpo = document.createElement("tbody");
		var primeiraCelula = document.createElement("th");
		var quantidadeDeEstados = 0;
		var quantidadeDeSimbolos = 0;
		primeiraCelula.innerHTML = ".";
		linhaDeCabecalho.appendChild(primeiraCelula);	
		Utilitarios.paraCada(automatoFinito.alfabeto, function(simbolo, chave) {
			var colunaComSimbolo = document.createElement("th");
			colunaComSimbolo.innerHTML = simbolo;
			linhaDeCabecalho.appendChild(colunaComSimbolo);
			quantidadeDeSimbolos++;
		});
		cabecalho.appendChild(linhaDeCabecalho);
		Utilitarios.paraCada(automatoFinito.estados, function(estado, chave) {
			var linhaDoCorpo = document.createElement("tr");
			var colunaComEstado = document.createElement("th");
			colunaComEstado.innerHTML = estado.toString();
			linhaDoCorpo.appendChild(colunaComEstado);
			linhasDoCorpo.push(linhaDoCorpo);
			quantidadeDeEstados++;
		});
		var indiceEstado;
		var indiceSimbolo;
		for (indiceEstado = 0; indiceEstado < quantidadeDeEstados; indiceEstado++) {
			for (indiceSimbolo = 0; indiceSimbolo <  quantidadeDeSimbolos; indiceSimbolo++) {
				var colunaDeTransicao = document.createElement("td");
				var editorDaTransicao = document.createElement("input");
				editorDaTransicao.setAttribute("type", "text");
				editorDaTransicao.setAttribute("class", "transicaoDeAutomatoFinito");
				editorDaTransicao.onblur = function() {
					adicionarTransicaoDeEstadoDeAutomatoFinito(indiceEstado, indiceSimbolo, editorDaTransicao.value);
				};
				editorDaTransicao.onkeypress = function(evento) {
					if (evento.keyCode === 13) {
						adicionarTransicaoDeEstadoDeAutomatoFinito(indiceEstado, indiceSimbolo, editorDaTransicao.value);
					}
				};
				if (automatoFinito.transicoes[indiceEstado] !== undefined && automatoFinito.transicoes[indiceEstado][indiceSimbolo] !== undefined) {
					editorDaTransicao.setAttribute("value", automatoFinito.transicoes[indiceEstado][indiceSimbolo]);
				}
				colunaDeTransicao.appendChild(editorDaTransicao);
				linhasDoCorpo[indiceEstado].appendChild(colunaDeTransicao);
			}
			corpo.appendChild(linhasDoCorpo[indiceEstado]);
		}
		tabela.appendChild(cabecalho);
		tabela.appendChild(corpo);
		tabela.setAttribute("id", "tabelaDoAutomatoFinitoSelecionado");
		var tabelaAntiga = identificador("tabelaDoAutomatoFinitoSelecionado");
		if (tabelaAntiga !== null) {
			automatoFinitoExpressaoRegular.removeChild(tabelaAntiga);
		}
		automatoFinitoExpressaoRegular.appendChild(tabela);
	};
	
	adicionarEstadoDeAutomatoFinito = function() {
		var texto = textoAdicionarEstadoDeAutomatoFinito.value.toLocaleUpperCase();
		if (Regulares.adicionarEstadoDeAutomatoFinito(obterSelecionado(), texto)) {
			mostrarAutomatoFinito();
			mostrarMensagem("informativo", "Estado <strong>"+texto+"</strong> adicionado.");
		} else {
			mostrarMensagem("aviso", "Não é possível inseir esse estado, por favor escolha uma letra maisúcula que ainda não é um estado.");
		}
		textoAdicionarEstadoDeAutomatoFinito.value = "";
		textoAdicionarEstadoDeAutomatoFinito.focus();
	};
	
	adicionarSimboloDeAutomatoFinito = function() {
		var texto = textoAdicionarSimboloDeAutomatoFinito.value.toLocaleLowerCase();
		if (Regulares.adicionarSimboloDeAutomatoFinito(obterSelecionado(), texto)) {
			mostrarAutomatoFinito();
			mostrarMensagem("informativo", "Símbolo do alfabeto <strong>"+texto+"</strong> adicionado.");
		} else {
			mostrarMensagem("aviso", "Não é possível inseir esse símbolo, por favor escolha uma letra minúscula ou um dígito que ainda não é um símbolo.");
		}
		textoAdicionarSimboloDeAutomatoFinito.value = "";
		textoAdicionarSimboloDeAutomatoFinito.focus();
	};
	
	adicionarTransicaoDeEstadoDeAutomatoFinito = function(l, c, t) {
		Regulares.adicionarTransicao(obterSelecionado(), l, c, t);
	};
	
	desabilitarBotoesDoMenuPrincipal = function() {
		botaoCriarAutomatoFinito.setAttribute("disabled", "disabled");
		botaoCriarExpressaoRegular.setAttribute("disabled", "disabled");
	};
	
	habilitarBotoesDoMenuPrincipal = function() {
		botaoCriarAutomatoFinito.removeAttribute("disabled");
		botaoCriarExpressaoRegular.removeAttribute("disabled");
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
		temporizadorDaCaixaDeMensagens = window.setTimeout(limparMensagem, 5000);
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
		automatoFinitoExpressaoRegular = identificador("automatoFinitoExpressaoRegular");
		botaoAdicionarSimboloDeAutomatoFinito = identificador("botaoAdicionarSimboloDeAutomatoFinito");
		textoAdicionarSimboloDeAutomatoFinito = identificador("textoAdicionarSimboloDeAutomatoFinito");
		botaoCriarAutomatoFinito.onclick = function() {
			criarAutomatoFinito();
		};
		botaoAdicionarEstadoDeAutomatoFinito.onclick = function() {
			adicionarEstadoDeAutomatoFinito();
		};
		botaoAdicionarSimboloDeAutomatoFinito.onclick = function() {
			adicionarSimboloDeAutomatoFinito();
		};
	};
	
	window.onload = adicionarTratadores;
}());