"use strict";

var ConjuntoDeExpressoesRegulares = {};

var ExpressaoRegular = new Prototipo({
	inicializar: function() {
		this.expressaoRegularTextual = "";
		this.arvoreDeConstrucao = null;
	}
}); 

var ArvoreBinaria = new Prototipo({
	inicializar: function() {
		this.quantidadeDeElementos = 0;
		this.raiz = null;
	},
	
	adicionarRaiz: function(elemento) {
		var nodoRaiz = new Nodo(elemento);
		if (this.raiz !== null) {
			this.raiz.pai = nodoRaiz;
			nodoRaiz.filhoDaEsquerda = this.raiz;
		}
		this.raiz = nodoRaiz;
		return nodoRaiz;
	},
	
	adicionarPai: function(nodoFilho, elemento) {
		if (nodoFilho.pai === null) {
			return this.adicionarRaiz(elemento);
		} else {
			var nodoPai = new Nodo(elemento);
			nodoPai.pai = nodoFilho.pai;
			if (nodoFilho.pai.filhoDaEsqueda === nodoFilho) {
				nodoPai.pai.filhoDaEsquerda = nodoPai;
			} else {
				nodoPai.pai.filhoDaDireita = nodoPai;
			}
			nodoPai.filhoDaEsquerda = nodoFilho;
			nodoFilho.pai = nodoPai;
			return nodoPai;
		}
	},
	
	adicionarFilhoNaEsquerda: function(nodoPai, elemento) {
		var nodoFilho = new Nodo(elemento);
		return this.adicionarNodoFilhoNaEsquerda(nodoPai, nodoFilho);
	},
	
	adicionarFilhoNaDireita: function(nodoPai, elemento) {
		var nodoFilho = new Nodo(elemento);
		return this.adicionarNodoFilhoNaDireita(nodoPai, nodoFilho);
	},
	
	adicionarNodoFilhoNaEsquerda: function(nodoPai, nodoFilho) {
//		nodoFilho.filhoDaEsquerda = nodoPai.filhoDaEsquerda;
		nodoFilho.pai = nodoPai;
		nodoPai.filhoDaEsquerda = nodoFilho;
		return nodoFilho;
	},
	
	adicionarNodoFilhoNaDireita: function(nodoPai, nodoFilho) {
//		nodoFilho.filhoDaEsquerda = nodoPai.filhoDaDireita;
		nodoFilho.pai = nodoPai;
		nodoPai.filhoDaDireita = nodoFilho;
		return nodoFilho;
	},
	
	fornecerNodos: function() {
		var fila = [];
		var indice = 0;
		if (this.raiz !== null) {
			fila.push(this.raiz);
			while (indice < fila.length) {
				var nodoAtual = fila[indice];
				if (nodoAtual.filhoDaEsquerda !== null) {
					fila.push(nodoAtual.filhoDaEsquerda);
				} 
				if (nodoAtual.filhoDaDireita !== null) {
					fila.push(nodoAtual.filhoDaDireita);
				}
				indice++;
			}
		}
		return fila;
	},
	
	comoTexto: function() {
		var fila = [];
		var texto = "";
		fila.push(this.raiz);
		if (this.raiz !== null) {
			while (fila.length > 0) {
				var nodoAtual = fila.shift();
				texto += nodoAtual.comoTexto();
				if (!Utilitarios.instanciaDe(nodoAtual, SimboloDoAlfabeto)) {
					if (nodoAtual.filhoDaEsquerda !== null) {
						fila.push(nodoAtual.filhoDaEsquerda);
					} else {
						fila.push(new SimboloDoAlfabeto("E"));
					}
					if (nodoAtual.filhoDaDireita !== null) {
						fila.push(nodoAtual.filhoDaDireita);
					} else {
						fila.push(new SimboloDoAlfabeto("D"));
					}
				}
			}
			return texto;
		}
		return "Árvore vazia.";
	}
});

var Nodo = new Prototipo({
	inicializar: function(elemento) {
		this.elemento = elemento;
		this.filhoDaEsquerda = null;
		this.filhoDaDireita = null;
		this.pai = null;
	},
	
	comoTexto: function() {
		return this.elemento.comoTexto();
	}
});

var TabelaDeSimbolosConstrutora = new Prototipo({
	inicializar: function() {
		this.arvore = new ArvoreBinaria();
		this.pilha = [];
		this.excecaoDeExpressaoRegularInvalida = new ExcecaoUtilitarios("Expressão regular inválida.");
		this.nodosFolha = 0;
	},
	
	costurarArvore: function() {
		var nodos = this.arvore.fornecerNodos();
		Utilitarios.paraCada(nodos, function(nodo, indiceDoNodo) {
			var elemento = nodo.elemento;
			elemento.nodo = nodo;
			if (Utilitarios.instanciaDe(elemento, OperacaoBinaria) && elemento.simbolo === ".") {
				elemento.costura = nodo.filhoDaDireita;
			} else if (Utilitarios.instanciaDe(elemento, OperacaoUnaria) || 
					Utilitarios.instanciaDe(elemento, SimboloDoAlfabeto) ||
					(Utilitarios.instanciaDe(elemento, OperacaoBinaria) && elemento.simbolo === "|")) {
				var costura = nodo.pai;
				var nodoAtual = nodo;
				while (costura !== null && costura.filhoDaEsquerda !== nodoAtual) {
					nodoAtual = costura;
					costura = costura.pai;
				}
				elemento.costura = costura;
			}
		});
	},
	
	construir: function(expressaoRegular) {
		try {
			expressaoRegular = new String(expressaoRegular);
			Utilitarios.paraCada(expressaoRegular, function(simbolo, indiceDoSimbolo) {
				var operacao = simbolo;
				if (/[a-z]|[0-9]|&/.exec(simbolo) !== null) {
					operacao = "simboloDoAlfabeto";
				}
				if (this[operacao] === undefined) {
					throw this.excecaoDeExpressaoRegularInvalida;
				}
				this[operacao](simbolo);
			}, this);
			var topoDaPilha = this.pilha.pop();
			if (Utilitarios.instanciaDe(topoDaPilha, SimboloDoAlfabeto)) {
				this.arvore.adicionarRaiz(topoDaPilha);
			} else if (Utilitarios.instanciaDe(topoDaPilha, Nodo)) {
				
			} else {
				throw this.excecaoDeExpressaoRegularInvalida;
			}
//			console.log(this.arvore.comoTexto());
			this.costurarArvore();
		} catch (excecao) {
			if (excecao.mensagem === "Expressão regular inválida.") {
				return false;
			}
			throw new ExcecaoUtilitarios("Erro na construção da árvore da expressão regular");
		}
		return true;
	},
	
	"simboloDoAlfabeto": function(simbolo) { 
		var topoDaPilha = this.pilha.pop();
		if (topoDaPilha !== undefined && (Utilitarios.instanciaDe(topoDaPilha, OperacaoBinaria) && topoDaPilha.simbolo === ".")) {
			topoDaPilha = this.pilha.pop();
		}
		this.nodosFolha++;
		var simboloDoAlfabeto = new SimboloDoAlfabeto(simbolo);
		simboloDoAlfabeto.indiceNaArvore = this.nodosFolha;
		if (topoDaPilha === undefined) {
			this.pilha.push(simboloDoAlfabeto);
		} else if (Utilitarios.instanciaDe(topoDaPilha, SimboloDeAgrupamento) && topoDaPilha.simbolo === "(") {
			this.pilha.push(topoDaPilha);
			this.pilha.push(simboloDoAlfabeto);
		} else if (Utilitarios.instanciaDe(topoDaPilha, SimboloDoAlfabeto)) {
			var nodoDaOperacao = this.arvore.adicionarRaiz(new OperacaoBinaria("."));
			this.arvore.adicionarFilhoNaEsquerda(nodoDaOperacao, topoDaPilha);
			this.arvore.adicionarFilhoNaDireita(nodoDaOperacao, simboloDoAlfabeto);
			this.pilha.push(nodoDaOperacao);
		} else if (Utilitarios.instanciaDe(topoDaPilha, Nodo) && ((Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoBinaria) && topoDaPilha.elemento.simbolo === ".") || Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoUnaria) || topoDaPilha.elemento.inicioDeAgrupamento)) {
			var nodoDaOperacao = this.arvore.adicionarPai(topoDaPilha, new OperacaoBinaria("."));
			this.arvore.adicionarFilhoNaDireita(nodoDaOperacao, simboloDoAlfabeto);
			this.pilha.push(nodoDaOperacao);
		} else if (Utilitarios.instanciaDe(topoDaPilha, Nodo) && Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoBinaria) && topoDaPilha.elemento.simbolo === "|") {
			var nodoDaOperacao = this.arvore.adicionarPai(topoDaPilha.filhoDaDireita, new OperacaoBinaria("."));
			this.arvore.adicionarFilhoNaDireita(nodoDaOperacao, simboloDoAlfabeto);
			this.pilha.push(topoDaPilha);
		} else if (Utilitarios.instanciaDe(topoDaPilha, OperacaoBinaria) && topoDaPilha.simbolo === "|") {
			topoDaPilha = this.pilha.pop();
			if (Utilitarios.instanciaDe(topoDaPilha, SimboloDoAlfabeto)) {
				var nodoDaOperacao = this.arvore.adicionarRaiz(new OperacaoBinaria("|"));
				this.arvore.adicionarFilhoNaEsquerda(nodoDaOperacao, topoDaPilha);
				this.arvore.adicionarFilhoNaDireita(nodoDaOperacao, simboloDoAlfabeto);
				this.pilha.push(nodoDaOperacao);
			} else if (Utilitarios.instanciaDe(topoDaPilha, Nodo) && (Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoBinaria) || Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoUnaria))) {
				var nodoDaOperacao = this.arvore.adicionarPai(topoDaPilha, new OperacaoBinaria("|"));
				this.arvore.adicionarFilhoNaDireita(nodoDaOperacao, simboloDoAlfabeto);
				this.pilha.push(nodoDaOperacao);
			} else {
				throw this.excecaoDeExpressaoRegularInvalida;
			}
		} else {
			throw this.excecaoDeExpressaoRegularInvalida;
		}
	},
	
	"agrupamento": function(nodoRaizDoAgrupamento) {
		nodoRaizDoAgrupamento.elemento.inicioDeAgrupamento = true;
		var topoDaPilha = this.pilha.pop();
		if (topoDaPilha !== undefined && (Utilitarios.instanciaDe(topoDaPilha, OperacaoBinaria) && topoDaPilha.simbolo === ".")) {
			topoDaPilha = this.pilha.pop();
		}
		if (topoDaPilha === undefined) {
			this.arvore.raiz = nodoRaizDoAgrupamento;
			this.pilha.push(nodoRaizDoAgrupamento);
		} else if (Utilitarios.instanciaDe(topoDaPilha, SimboloDeAgrupamento) && topoDaPilha.simbolo === "(") {
			this.pilha.push(topoDaPilha);
			this.arvore.raiz = nodoRaizDoAgrupamento;
			this.pilha.push(nodoRaizDoAgrupamento);
		} else if (Utilitarios.instanciaDe(topoDaPilha, SimboloDoAlfabeto)) {
			var nodoDaOperacao = this.arvore.adicionarRaiz(new OperacaoBinaria("."));
			this.arvore.adicionarFilhoNaEsquerda(nodoDaOperacao, topoDaPilha);
			this.arvore.adicionarNodoFilhoNaDireita(nodoDaOperacao, nodoRaizDoAgrupamento);
			this.pilha.push(nodoDaOperacao);
		} else if (Utilitarios.instanciaDe(topoDaPilha, Nodo) && ((Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoBinaria) && topoDaPilha.elemento.simbolo === ".") || Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoUnaria) || topoDaPilha.elemento.inicioDeAgrupamento)) {
			var nodoDaOperacao = this.arvore.adicionarPai(topoDaPilha, new OperacaoBinaria("."));
			this.arvore.adicionarNodoFilhoNaDireita(nodoDaOperacao, nodoRaizDoAgrupamento);
			this.pilha.push(nodoDaOperacao);
		} else if (Utilitarios.instanciaDe(topoDaPilha, Nodo) && Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoBinaria) && topoDaPilha.elemento.simbolo === "|") {
			var nodoDaOperacao = this.arvore.adicionarPai(topoDaPilha.filhoDaDireita, new OperacaoBinaria("."));
			this.arvore.adicionarNodoFilhoNaDireita(nodoDaOperacao, nodoRaizDoAgrupamento);
			this.pilha.push(topoDaPilha);
		} else if (Utilitarios.instanciaDe(topoDaPilha, OperacaoBinaria) && topoDaPilha.simbolo === "|") {
			topoDaPilha = this.pilha.pop();
			if (Utilitarios.instanciaDe(topoDaPilha, SimboloDoAlfabeto)) {
				var nodoDaOperacao = this.arvore.adicionarRaiz(new OperacaoBinaria("|"));
				this.arvore.adicionarFilhoNaEsquerda(nodoDaOperacao, topoDaPilha);
				this.arvore.adicionarNodoFilhoNaDireita(nodoDaOperacao, nodoRaizDoAgrupamento);
				this.pilha.push(nodoDaOperacao);
			} else if (Utilitarios.instanciaDe(topoDaPilha, Nodo) && (Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoBinaria) || Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoUnaria))) {
				var nodoDaOperacao = this.arvore.adicionarPai(topoDaPilha, new OperacaoBinaria("|"));
				this.arvore.adicionarNodoFilhoNaDireita(nodoDaOperacao, nodoRaizDoAgrupamento);
				this.pilha.push(nodoDaOperacao);
			} else {
				throw this.excecaoDeExpressaoRegularInvalida;
			}
		} else {
			throw this.excecaoDeExpressaoRegularInvalida;
		}
	},
	
	"operacaoUnaria": function(operacaoUnaria) {
		var topoDaPilha = this.pilha.pop();
		if (Utilitarios.instanciaDe(topoDaPilha, SimboloDoAlfabeto)) {
			var nodoDaOperacao = this.arvore.adicionarRaiz(operacaoUnaria);
			this.arvore.adicionarFilhoNaEsquerda(nodoDaOperacao, topoDaPilha);
			this.pilha.push(nodoDaOperacao);
		} else if (Utilitarios.instanciaDe(topoDaPilha, Nodo) && Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoBinaria)) {
			var nodoAtual = topoDaPilha;
			while (!nodoAtual.elemento.inicioDeAgrupamento) {
				nodoAtual = nodoAtual.filhoDaDireita;
				if (nodoAtual === null) {
					throw this.excecaoDeExpressaoRegularInvalida;
				}
			}
			this.arvore.adicionarPai(nodoAtual, operacaoUnaria);
			this.pilha.push(this.arvore.raiz);
		} else {
			throw this.excecaoDeExpressaoRegularInvalida;
		}	
	},
	
	"*": function() {
		this.operacaoUnaria(new OperacaoUnaria("*"));
	},
	
	".": function() {
		var topoDaPilha = this.pilha.pop();
		if (Utilitarios.instanciaDe(topoDaPilha, SimboloDoAlfabeto)) {
			this.pilha.push(topoDaPilha);
			this.pilha.push(new OperacaoBinaria("."));
		} else if (Utilitarios.instanciaDe(topoDaPilha, Nodo) && Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoBinaria)) {
			this.pilha.push(topoDaPilha);
			this.pilha.push(new OperacaoBinaria("."));
		} else if (Utilitarios.instanciaDe(topoDaPilha, Nodo) && Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoUnaria)) {
			this.pilha.push(topoDaPilha);
			this.pilha.push(new OperacaoBinaria("."));
		} else {
			throw this.excecaoDeExpressaoRegularInvalida;
		}
	},
	
	"|": function() {
		var topoDaPilha = this.pilha.pop();
		if (Utilitarios.instanciaDe(topoDaPilha, SimboloDoAlfabeto)) {
			this.pilha.push(topoDaPilha);
			this.pilha.push(new OperacaoBinaria("|"));
		} else if (Utilitarios.instanciaDe(topoDaPilha, Nodo) && Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoBinaria)) {
			this.pilha.push(topoDaPilha);
			this.pilha.push(new OperacaoBinaria("|"));
		} else if (Utilitarios.instanciaDe(topoDaPilha, Nodo) && Utilitarios.instanciaDe(topoDaPilha.elemento, OperacaoUnaria)) {
			this.pilha.push(topoDaPilha);
			this.pilha.push(new OperacaoBinaria("|"));
		} else {
			throw this.excecaoDeExpressaoRegularInvalida;
		}
	},
	
	"+": function() {
		this.operacaoUnaria(new OperacaoUnaria("+"));
	},
	
	"?": function() {
		this.operacaoUnaria(new OperacaoUnaria("?"));
	},
	
	"(": function() {
		this.pilha.push(new SimboloDeAgrupamento("(", this.arvore));
		this.arvore = new ArvoreBinaria();
	},
	
	")": function() {
		var topoDaPilha = this.pilha.pop();
		if (!(Utilitarios.instanciaDe(topoDaPilha, SimboloDeAgrupamento) && topoDaPilha.simbolo === "(")) {
			var simboloDeAbertura = this.pilha.pop();
			if (!(Utilitarios.instanciaDe(simboloDeAbertura, SimboloDeAgrupamento) && simboloDeAbertura.simbolo === "(")) {
				throw this.excecaoDeExpressaoRegularInvalida;
			}
			this.arvore = simboloDeAbertura.arvoreSalva;
			if (Utilitarios.instanciaDe(topoDaPilha, SimboloDoAlfabeto)) {
 				this.simboloDoAlfabeto(topoDaPilha.simbolo);
			} else if (Utilitarios.instanciaDe(topoDaPilha, Nodo)) {
				this.agrupamento(topoDaPilha);
			} else {
				throw this.excecaoDeExpressaoRegularInvalida;
			}
		}
	}
});

var OperacaoUnaria = new Prototipo({
	inicializar: function(operacao) {
		this.simbolo = operacao;
		this.inicioDeAgrupamento = false;
		this.nodo = null;
		this.costura = null;
	},
	
	comoTexto: function() {
		return this.simbolo;
	},
	
	subir: function(composicao) {
		if (this.simbolo === "*" || this.simbolo === "+") {
			this.nodo.filhoDaEsquerda.elemento.descer(composicao);
		}
		if (this.costura !== null) {
			this.costura.elemento.subir(composicao);
		} else {
			composicao.final = true;
		}
	},
	
	descer: function(composicao) {
		this.nodo.filhoDaEsquerda.elemento.descer(composicao);
		if (this.costura !== null) {
			this.costura.elemento.subir(composicao);
		} else {
			composicao.final = true;
		}
	}
});

var OperacaoBinaria = new Prototipo({
	inicializar: function(operacao) {
		this.simbolo = operacao;
		this.inicioDeAgrupamento = false;
		this.nodo = null;
		this.costura = null;
	},
	
	comoTexto: function() {
		return this.simbolo;
	},
	
	subir: function(composicao) {
		if (this.simbolo === ".") {
			this.costura.elemento.descer(composicao);
		} else	if (this.simbolo === "|") {
			if (this.costura !== null) { 
				this.costura.elemento.subir(composicao);
			} else {
				composicao.final = true;
			}
		}
	},
	
	descer: function(composicao) {
		this.nodo.filhoDaEsquerda.elemento.descer(composicao);
		if (this.simbolo === "|") {
			this.nodo.filhoDaDireita.elemento.descer(composicao);
		}
	}
});

var SimboloDoAlfabeto = new Prototipo({
	inicializar: function(simbolo) {
		this.simbolo = simbolo;
		this.inicioDeAgrupamento = true;
		this.indiceNaArvore = null;
		this.nodo = null;
		this.costura = null;
	},
	
	comoTexto: function() {
		return this.simbolo;
	},
	
	subir: function(composicao) {
		if (this.costura !== null) {
			this.costura.elemento.subir(composicao);
		} else {
			composicao.final = true;
		}
	},
	
	descer: function(composicao) {
		if (composicao[this.simbolo] === undefined) {
			composicao[this.simbolo] = {};
		}
		composicao[this.simbolo][(this.indiceNaArvore).toString()] = this.nodo;
	}
});

var SimboloDeAgrupamento = new Prototipo({
	inicializar: function(simbolo, arvoreSalva) {
		this.simbolo = simbolo;
		this.arvoreSalva = arvoreSalva;
	},
	
	comoTexto: function() {
		return this.simbolo;
	}
});

var ProvedorDeSimbolosDeEstados = new Prototipo({
	inicializar: function() {
		this.simbolosDeEstados = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "W", "V", "X", "Y", "Z"];
	},
	
	fornecerNovo: function() {
		return this.simbolosDeEstados.shift();
	}
});

var ExpressoesRegulares = {
	criar: function(nome) {
		if (ConjuntoDeExpressoesRegulares[nome] === undefined) {
			ConjuntoDeExpressoesRegulares[nome] = new ExpressaoRegular();
			return true;
		}
		return false;
	},
	
	salvar: function(nome, expressaoRegularTextual) {
		var expressaoRegular = ConjuntoDeExpressoesRegulares[nome];
		var construtorDaArvore = new TabelaDeSimbolosConstrutora();
		if (expressaoRegular !== undefined && construtorDaArvore.construir(expressaoRegularTextual)) {
			expressaoRegular.expressaoRegularTextual = expressaoRegularTextual;
			expressaoRegular.arvoreDeConstrucao = construtorDaArvore.arvore;
			return true;
		} else {
			expressaoRegular.arvoreDeConstrucao = null;
		}
		return false;
	},
	
	converterParaAutomatoFinito: function(nome) {
		var expressaoRegular = ConjuntoDeExpressoesRegulares[nome];
		if (expressaoRegular !== undefined && expressaoRegular.arvoreDeConstrucao !== null) {
			var provedorDeSimbolosDeEstados = new ProvedorDeSimbolosDeEstados();
			var estadosPendentes = [];
			var estados = {};
			var estadosAvaliadosEPendentes = {};
			var simboloDoEstadoInicial = provedorDeSimbolosDeEstados.fornecerNovo();
			var estadoInicial = this.criarEstado(simboloDoEstadoInicial, null);
			estadoInicial.inicial = true;
			estados[simboloDoEstadoInicial] = estadoInicial; 
			estadosAvaliadosEPendentes[simboloDoEstadoInicial] = estadoInicial;
			expressaoRegular.arvoreDeConstrucao.raiz.elemento.descer(estadoInicial.composicao);
			estadoInicial.final = estadoInicial.composicao.final;
			delete estadoInicial.composicao["final"];
			Utilitarios.paraCada(estadoInicial.composicao, function(nodosFolha, simbolo) {
				var simboloDoEstado = provedorDeSimbolosDeEstados.fornecerNovo();
				var estadoDeTransicao = this.criarEstado(simboloDoEstado, nodosFolha);
				estadosPendentes.push(estadoDeTransicao);
				estadosAvaliadosEPendentes[simboloDoEstado] = estadoDeTransicao;
				estadoInicial.transicoes[simbolo] = estadoDeTransicao; 
			}, this);
			while (estadosPendentes.length > 0) {
				var estadoPendente = estadosPendentes.shift();
				Utilitarios.paraCada(estadoPendente.nodosFolha, function(nodoFolha, indiceDoNodoFolha) {
					nodoFolha.elemento.subir(estadoPendente.composicao);
					estadoPendente.final = estadoPendente.composicao.final;
				});
				delete estadoPendente.composicao["final"];
				var estadoEquivalente = this.encontrarEstadoEquivalente(estados, estadoPendente.composicao);
				if (estadoEquivalente !== null) {
					Utilitarios.paraCada(estadosAvaliadosEPendentes, function(estado, simboloDoEstado) {
						Utilitarios.paraCada(estado.transicoes, function(transicao, simboloDaTransicao) {
							if (transicao === estadoPendente) {
								estado.transicoes[simboloDaTransicao] = estadoEquivalente;
							}
						});
					});
					delete estadosAvaliadosEPendentes[estadoPendente.simbolo];
				} else {
					Utilitarios.paraCada(estadoPendente.composicao, function(nodosFolha, simbolo) {
						var estadoDeTransicao = this.encontrarEstadoDeTransicao(estadosAvaliadosEPendentes, nodosFolha);
						if (estadoDeTransicao === null) {
							var simboloDoEstado = provedorDeSimbolosDeEstados.fornecerNovo();
							estadoDeTransicao = this.criarEstado(simboloDoEstado, nodosFolha);
							estadosPendentes.push(estadoDeTransicao);
							estadosAvaliadosEPendentes[simboloDoEstado] = estadoDeTransicao;
						}
						estadoPendente.transicoes[simbolo] = estadoDeTransicao; 
					}, this);
					estados[estadoPendente.simbolo] = estadoPendente;
				}
			}
			return estados;
		}
		return null;
	},
	
	criarEstado: function(simbolo, nodosFolha) {
		if (nodosFolha === null) {
			nodosFolha = {};
		}
		var estado = {
			simbolo: simbolo,
			transicoes: {},
			composicao: {
				final: false
			},
			nodosFolha: nodosFolha,
			final: false,
			inicial: false
		};
		return estado;
	},
	
	encontrarEstadoDeTransicao: function(estados, nodosFolha) {
		var estadoDaTransicao = null;
		Utilitarios.paraCada(estados, function(estado, simboloDoEstado) {
			var encontrouEstadoDeTransicao = true;
			if (estado.nodosFolha !== undefined && Object.keys(estado.nodosFolha).length === Object.keys(nodosFolha).length) {
				Utilitarios.paraCada(nodosFolha, function(nodoFolha, indiceDoNodoFolha) {
					var nodoFolhaDoEstadoDeTransicao = estado.nodosFolha[indiceDoNodoFolha];
					if (nodoFolhaDoEstadoDeTransicao === undefined || nodoFolhaDoEstadoDeTransicao !== nodoFolha) {
						encontrouEstadoDeTransicao = false;
					}
				});
			} else {
				encontrouEstadoDeTransicao = false;
			}
			if (encontrouEstadoDeTransicao) {
				estadoDaTransicao = estado;
				return;
			}
		});
		return estadoDaTransicao;
	},
	
	encontrarEstadoEquivalente: function(estados, composicao) {
		var estadoEquivalente = null;
		Utilitarios.paraCada(estados, function(estado, simboloDoEstado) {
			if (Object.keys(estado.composicao).length === Object.keys(composicao).length) {
				var encontrouEstadoEquivalente = true;
				Utilitarios.paraCada(composicao, function(agrupamentoDoSimbolo, simbolo) {
					var agrupamentoDoSimboloDoEstado = estado.composicao[simbolo];
					if (agrupamentoDoSimboloDoEstado !== undefined && Object.keys(agrupamentoDoSimboloDoEstado).length === Object.keys(agrupamentoDoSimbolo).length) {
						Utilitarios.paraCada(agrupamentoDoSimbolo, function(nodoFolha, indiceDoNodoFolha) {
							var nodoFolhaDoEstado = agrupamentoDoSimboloDoEstado[indiceDoNodoFolha];
							if (nodoFolhaDoEstado === undefined || nodoFolhaDoEstado !== nodoFolha) {
								encontrouEstadoEquivalente = false;
								return;
							}
						});
					} else {
						encontrouEstadoEquivalente = false;
						return;
					}
				});
				if (encontrouEstadoEquivalente) {
					estadoEquivalente = estado;
					return;
				}
			}
		});
		return estadoEquivalente;
	},
	
	 clonar: function(nomeDaExpressaoRegular, nomeDaExpressaoRegularClonada) {
		 var expressaoRegular = ConjuntoDeExpressoesRegulares[nomeDaExpressaoRegular];
		 if (expressaoRegular !== undefined && this.criar(nomeDaExpressaoRegularClonada)) {
			 return this.salvar(nomeDaExpressaoRegularClonada, expressaoRegular.expressaoRegularTextual);
		 }
		 return false;
	 },
	 
	 verificarEquivalencia: function(nomeDaExpressaoRegularA, nomeDaExpressaoRegularB) {
		 var automatoFinitoConvertidoA = this.converterParaAutomatoFinito(nomeDaExpressaoRegularA);
		 var automatoFinitoConvertidoB = this.converterParaAutomatoFinito(nomeDaExpressaoRegularB);
		 return false;
	 }
};