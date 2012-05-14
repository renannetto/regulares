ConjuntoDeAutomatosFinitos = {};

AutomatoFinito = new Prototipo({
	inicializar: function() {
//		this.estados = {"!": new Estado("!")};
//		this.alfabeto = {"&": new Simbolo("&")};
//		this.estadosFinais = [this.estados["!"]];
//		this.estadoInicial = this.estados["!"];
//		this.transicoes = {"!": {"&": new TransicaoDeEstado(this.estados["!"], [this.estados["!"]], this.alfabeto["&"])}};
//		this.estados["!"].serInicial();
//		this.estados["!"].serFinal();
		this.estados = {"!": new Estado("!")};
		this.alfabeto = {};
		this.estadosFinais = [];
		this.estadoInicial = this.estados["!"];
		this.transicoes = {"!": {}};
		this.estados["!"].serInicial();
	}
});

TransicaoDeEstado = new Prototipo({
	inicializar: function(estadoDeOrigem, estadosDeDestino, simboloDeTransicao) {
		this.estadoDeOrigem = estadoDeOrigem;
		this.estadosDeDestino = estadosDeDestino.sort();
		this.simboloDeTransicao = simboloDeTransicao;
	},
	
	toString: function() {
		return this.estadosDeDestino.join(", ");
	}
});

Estado = new Prototipo({
	inicializar: function(simbolo) {
		this.simbolo = simbolo;
		this.inicial = false;
		this.final = false;
	},
	
	toString: function() {
		return this.simbolo;
	},
	
	serInicial: function() {
		this.inicial = true;
	},
	
	serFinal: function() {
		this.final = true;
	},
	
	 deixarDeSerInicial: function() {
		 this.inicial = false;
	 },
	 
	 deixarDeSerFinal: function() {
		 this.final = false;
	 }
});

Simbolo = new Prototipo({
	inicializar: function(simbolo) {
		this.simbolo = simbolo;
	},
	
	toString: function() {
		return this.simbolo;
	}
});

AutomatosFinitos = {
	criar: function(nome) {
		if (ConjuntoDeAutomatosFinitos[nome] === undefined) {
			ConjuntoDeAutomatosFinitos[nome] = new AutomatoFinito();
			return true;
		} 
		return false;
	},
	
	fornecer: function(nome) {
		return ConjuntoDeAutomatosFinitos[nome];
	},
	
	adicionarEstado: function(nomeDoAutomato, chaveDoEstado) {
		var automato = ConjuntoDeAutomatosFinitos[nomeDoAutomato];
		if (automato !== undefined) {
			var estadoAdicionado = this.adicionarEstadoOuSimbolo(automato.estados, /\[?[A-Z]+\]?/, chaveDoEstado, Estado, function() {
				var transicoesDoEstado = {};
				automato.transicoes[chaveDoEstado] = transicoesDoEstado;
				Utilitarios.paraCada(automato.alfabeto, function(simbolo, chaveDoSimbolo) {
					transicoesDoEstado[chaveDoSimbolo] = new TransicaoDeEstado(automato.estados[chaveDoEstado], [automato.estados["!"]], simbolo);
				});
			});
			return estadoAdicionado;
		}
		return false;
	},
	
	adicionarSimbolo: function(nomeDoAutomato, chaveDoSimbolo) {
		var automato = ConjuntoDeAutomatosFinitos[nomeDoAutomato];
		if (automato !== undefined) {
			var simboloAdicionado = this.adicionarEstadoOuSimbolo(automato.alfabeto, /[a-z]|[0-9]|&/, chaveDoSimbolo, Simbolo, function() {
				Utilitarios.paraCada(automato.estados, function(estado, chaveDoEstado) {
					automato.transicoes[chaveDoEstado][chaveDoSimbolo] = new TransicaoDeEstado(estado, [automato.estados["!"]], automato.alfabeto[chaveDoSimbolo]);
				});
			});
			return simboloAdicionado;
		}
		return false;
	},
	
	adicionarEstadoOuSimbolo: function(conjunto, expressaoRegular, simbolo, prototipo, adicionarTransicao) {
		var avaliacaoDeExpressaoRegular = expressaoRegular.exec(simbolo);
		var estadoValido = (avaliacaoDeExpressaoRegular !== null && avaliacaoDeExpressaoRegular.length === 1);
		if (conjunto[simbolo] === undefined && estadoValido) {
			conjunto[simbolo] = new prototipo(simbolo);
			adicionarTransicao();
			return true;
		}
		return false;
	},
	
	fixarTransicao: function(nomeDoAutomato, chaveDoEstado, chaveDoSimbolo, chavesDosEstadosDaTransicao) {
		var automato = ConjuntoDeAutomatosFinitos[nomeDoAutomato];
		if (automato === undefined || 
				automato.estados[chaveDoEstado] === undefined ||
				chaveDoEstado === "!" ||
				automato.alfabeto[chaveDoSimbolo] === undefined || 
				chavesDosEstadosDaTransicao.length === 0) {
			return false;
		}
		var transicaoValida = true;
		var estadosDaTransicao = [];
		Utilitarios.paraCada(chavesDosEstadosDaTransicao, function(chaveDoEstado, indice) {
			var estado = automato.estados[chaveDoEstado]; 
			if (estado === undefined || estadosDaTransicao.indexOf(estado) !== -1) {
				transicaoValida = false;
			} 
			estadosDaTransicao[indice] = estado;
		});
		if (transicaoValida) {
			automato.transicoes[chaveDoEstado][chaveDoSimbolo] = new TransicaoDeEstado(automato.estados[chaveDoEstado], estadosDaTransicao, automato.alfabeto[chaveDoSimbolo]);
		}
		return transicaoValida;
	},
	
	fixarEstadoInicial: function(nomeDoAutomato, chaveDoEstado) {
		var automato = ConjuntoDeAutomatosFinitos[nomeDoAutomato];
		if (automato === undefined && automato.estados[chaveDoEstado] === undefined) {
			return false;
		}
		automato.estadoInicial.deixarDeSerInicial();
		automato.estados[chaveDoEstado].serInicial();
		automato.estadoInicial = automato.estados[chaveDoEstado];
		return true;
	},

	adicionarEstadoFinal: function(nomeDoAutomato, chaveDoEstado) {
		var automato = ConjuntoDeAutomatosFinitos[nomeDoAutomato];
		if ((automato === undefined && automato.estados[chaveDoEstado] === undefined) || chaveDoEstado === "!") {
			return false;
		}
		automato.estados[chaveDoEstado].serFinal();
		automato.estadosFinais.push(automato.estados[chaveDoEstado]);
		return true;
	},
	
	removerEstadoFinal: function(nomeDoAutomato, chaveDoEstado) {
		var automato = ConjuntoDeAutomatosFinitos[nomeDoAutomato];
		if (automato === undefined || automato.estados[chaveDoEstado] === undefined) {
			return false;
		}
		automato.estados[chaveDoEstado].deixarDeSerFinal();
		var indice = automato.estadosFinais.indexOf(automato.estados[chaveDoEstado]);
		if (indice >= 0) {
			automato.estadosFinais.splice(indice, 1);
		}
		return true;
	},
	
	determinizar: function(nomeDoAutomato, estados, primeiro) {
		var novosEstadosCompostos = [];
		var automato = ConjuntoDeAutomatosFinitos[nomeDoAutomato];
		if (automato === undefined) {
			return false;
		}
		if (estados === undefined) {
			estados = automato.estados;
		}
		Utilitarios.paraCada(estados, function(estado, chaveDoEstado) {
			Utilitarios.paraCada(automato.alfabeto, function(simbolo, chaveDoSimbolo) {
				if (automato.transicoes[chaveDoEstado][chaveDoSimbolo].estadosDeDestino.length > 1) {
					this.comporEstado(nomeDoAutomato, automato, chaveDoEstado, chaveDoSimbolo, novosEstadosCompostos);
				}
			}, this);
		}, this);
		if (novosEstadosCompostos.length > 0) {
			this.determinizar(nomeDoAutomato, estados, false);
		}
		if (primeiro !== undefined && primeiro === false) {
			this.juntarEstadosCompostos(nomeDoAutomato, automato);
		}
		console.log(ConjuntoDeAutomatosFinitos);
		return true;
	},
	
	comporEstado: function(nomeDoAutomato, automato, chaveDoEstadoDeDestino, chaveDoSimboloDaTransicao, novosEstadosCompostos) {
		var transicao = automato.transicoes[chaveDoEstadoDeDestino][chaveDoSimboloDaTransicao];
		var chaveDoEstadoComposto = "[" + transicao.estadosDeDestino.join("") + "]";
		if (automato.estados[chaveDoEstadoComposto] === undefined){ 
			this.adicionarEstado(nomeDoAutomato, chaveDoEstadoComposto);
			novosEstadosCompostos.push(automato.estados[chaveDoEstadoComposto]);
		}
		Utilitarios.paraCada(automato.alfabeto, function(simbolo, chaveDoSimbolo) {
			var estadosDeDestinoDoEstadoComposto = [];
			Utilitarios.paraCada(transicao.estadosDeDestino, function(estado, indiceDoEstado) {
				if (estado.final) {
					this.adicionarEstadoFinal(nomeDoAutomato, chaveDoEstadoComposto);
//					automato.estados[chaveDoEstadoComposto].final = true;
				}
				Utilitarios.paraCada(automato.transicoes[estado.simbolo][chaveDoSimbolo].estadosDeDestino, function(estadoDeDestinoDoEstadoComposto, indiceDoEstadoDeDestinoDoEstadoComposto) {
					if (estadosDeDestinoDoEstadoComposto.indexOf(estadoDeDestinoDoEstadoComposto) === -1 && estadoDeDestinoDoEstadoComposto.simbolo !== "!") {
						estadosDeDestinoDoEstadoComposto.push(estadoDeDestinoDoEstadoComposto);
					}
				});
			}, this);
			if (estadosDeDestinoDoEstadoComposto.length === 0) {
				estadosDeDestinoDoEstadoComposto.push(automato.estados["!"]);
			}
			this.fixarTransicao(nomeDoAutomato, chaveDoEstadoComposto, chaveDoSimbolo, estadosDeDestinoDoEstadoComposto);
		}, this);
	},
	
	juntarEstadosCompostos: function(nomeDoAutomato, automato) {
		Utilitarios.paraCada(automato.estados, function(estado, chaveDoEstado) {
			Utilitarios.paraCada(automato.alfabeto, function(simbolo, chaveDoSimbolo) {
				var transicao = automato.transicoes[chaveDoEstado][chaveDoSimbolo];
				if (transicao.estadosDeDestino.length > 1) {
					var chaveDoEstadoComposto = "[" + transicao.estadosDeDestino.join("") + "]";
					this.fixarTransicao(nomeDoAutomato, chaveDoEstado, chaveDoSimbolo, [automato.estados[chaveDoEstadoComposto]]);
				}
			}, this);
		}, this);
	},
	
	minimizar: function(nomeDoAutomato) {
		var automato = ConjuntoDeAutomatosFinitos[nomeDoAutomato];
		console.log(ConjuntoDeAutomatosFinitos);
		if (automato === undefined || 
				!this.removerEstadosInacessiveis(automato, nomeDoAutomato) || 
				!this.removerEstadosMortos(automato, nomeDoAutomato) ||
				!this.removerEstadosEquivalentes(automato, nomeDoAutomato)) {
			return false;
		}
		return true;
	},
	
	removerEstadosInacessiveis: function(automato, nomeDoAutomato) {
		var estadosAcessiveis = {};
		var automatoDeterministico = true;
		obterEstadosAcessiveis = function(estadoDePartida) {
			Utilitarios.paraCada(automato.alfabeto, function(simbolo, chaveDoSimbolo) {
				var transicao = automato.transicoes[estadoDePartida.simbolo][chaveDoSimbolo];
				if (transicao.estadosDeDestino.length > 1) {
					automatoDeterministico = false;
				}
				var estadoAcessivel = transicao.estadosDeDestino[0];
				if (estadosAcessiveis[estadoAcessivel.simbolo] === undefined) {
					estadosAcessiveis[estadoAcessivel.simbolo] = estadoAcessivel;
					obterEstadosAcessiveis(estadoAcessivel);
				}
			});
		};
		estadosAcessiveis[automato.estadoInicial.simbolo] = automato.estadoInicial;
		obterEstadosAcessiveis(automato.estadoInicial);
		Utilitarios.paraCada(automato.estados, function(estado, chaveDoEstado) {
			if (estadosAcessiveis[chaveDoEstado] === undefined && chaveDoEstado !== "!") {
				this.removerEstado(nomeDoAutomato, automato, estado);
			}
		}, this);
		console.log(automato.estados);
		return automatoDeterministico;
	},
	
	removerEstadosMortos: function(automato, nomeDoAutomato) {
		var estadosVivos = {};
		var automatoDeterministico = true;
		obterEstadosVivos = function(estadoDeChegada) {
			Utilitarios.paraCada(automato.estados, function(estado, chaveDoEstado) {
				Utilitarios.paraCada(automato.alfabeto, function(simbolo, chaveDoSimbolo) {
					if (estadosVivos[chaveDoEstado] === undefined) {
						var transicao = automato.transicoes[chaveDoEstado][chaveDoSimbolo];
						if (transicao.estadosDeDestino > 1) {
							automatoDeterministico = false;
						}
						if (transicao.estadosDeDestino[0].simbolo === estadoDeChegada.simbolo) {
							estadosVivos[chaveDoEstado] = estado;
							obterEstadosVivos(estado);
						}
					}
				});
			});
		};
		Utilitarios.paraCada(automato.estadosFinais, function(estadoVivo, indiceDoEstadoVivo) {
			estadosVivos[estadoVivo.simbolo] = estadoVivo;
			obterEstadosVivos(estadoVivo);
		});
		Utilitarios.paraCada(automato.estados, function(estado, chaveDoEstado) {
			if (estadosVivos[chaveDoEstado] === undefined && chaveDoEstado !== "!") {
				this.removerEstado(nomeDoAutomato, automato, estado);
			}
		}, this);
		console.log(automato.estados);
		return automatoDeterministico;
	},
	
	removerEstadosEquivalentes: function(automato, nomeDoAutomato) {
		var automatoDeterministico = true;
		var classeDeEquivalenciaDeFinais = [];
		var classeDeEquivalenciaDeNaoFinais = [];
		var classesDeEquivalencia = [classeDeEquivalenciaDeFinais, classeDeEquivalenciaDeNaoFinais];
		var classesDeEquivalenciaAnterior = classesDeEquivalencia; 
		Utilitarios.paraCada(automato.estados, function(estado, chaveDoEstado) {
			if (estado.final) {
				classeDeEquivalenciaDeFinais.push(estado);
			} else {
				classeDeEquivalenciaDeNaoFinais.push(estado);
			}
		});
		var obterClasseDeEquivalenciaDoEstado = function(estado, classesDeEquivalencia) {
			var classeDeEquivalenciaDoEstado = undefined;
			Utilitarios.paraCada(classesDeEquivalencia, function(classeDeEquivalencia) {
				if (classeDeEquivalencia.indexOf(estado) >= 0) {
					classeDeEquivalenciaDoEstado = classeDeEquivalencia;
					return;
				}
			});
			return classeDeEquivalenciaDoEstado;
		};
		var verificarSeEstadosSaoEquivalentes = function(estado, estadoEquivalente, classesDeEquivalencia) {
			var saoEquivalentes = true;
			Utilitarios.paraCada(automato.alfabeto, function(simbolo, chaveDoSimbolo) {
				var estadosDeDestinoDoEstado = automato.transicoes[estado.simbolo][chaveDoSimbolo].estadosDeDestino;
				var estadosDeDestinoDoEstadoEquivalente = automato.transicoes[estadoEquivalente.simbolo][chaveDoSimbolo].estadosDeDestino;
				if (estadosDeDestinoDoEstado.length > 1 || estadosDeDestinoDoEstadoEquivalente.length > 1) {
					automatoDeterministico = true;
				}
				var classeDeEquivalenciaDoEstado = obterClasseDeEquivalenciaDoEstado(estadosDeDestinoDoEstado[0], classesDeEquivalencia);
				var classeDeEquivalenciaDoEstadoEquivalente = obterClasseDeEquivalenciaDoEstado(estadosDeDestinoDoEstadoEquivalente[0], classesDeEquivalencia);
				if (classeDeEquivalenciaDoEstado !== classeDeEquivalenciaDoEstadoEquivalente) {
					saoEquivalentes = false;
					return;
				}
			});
			return saoEquivalentes;
		};
		var formarClasseDeEquivalencia = function(estado, novasClassesDeEquivalencia, classesDeEquivalencia) {
			var classeDeEquivalenciaDoEstado = undefined;
			Utilitarios.paraCada(novasClassesDeEquivalencia, function(novaClasseDeEquivalencia) {
				var estadoEquivalente = novaClasseDeEquivalencia[0];
				var estadosEquivalentes = verificarSeEstadosSaoEquivalentes(estado, estadoEquivalente, classesDeEquivalencia);
				if (estadosEquivalentes) {
					classeDeEquivalenciaDoEstado = novaClasseDeEquivalencia;
					return;
				}
			});
			if (classeDeEquivalenciaDoEstado === undefined) {
				classeDeEquivalenciaDoEstado = [];
				novasClassesDeEquivalencia.push(classeDeEquivalenciaDoEstado);
			}
			classeDeEquivalenciaDoEstado.push(estado);
		};
		var formarClassesDeEquivalencia = function(classeDeEquivalencia, classesDeEquivalencia, classesDeEquivalenciaPosterior) {
			var novasClassesDeEquivalencia = [];
			Utilitarios.paraCada(classeDeEquivalencia, function(estado) {
				formarClasseDeEquivalencia(estado, novasClassesDeEquivalencia, classesDeEquivalencia);
			});
			classesDeEquivalenciaPosterior.push.apply(classesDeEquivalenciaPosterior, novasClassesDeEquivalencia);
		};
		do {
			var classesDeEquivalenciaPosterior = [];
			Utilitarios.paraCada(classesDeEquivalencia, function(classeDeEquivalencia) {
				formarClassesDeEquivalencia(classeDeEquivalencia, classesDeEquivalencia, classesDeEquivalenciaPosterior);
			});
			classesDeEquivalenciaAnterior = classesDeEquivalencia;
			classesDeEquivalencia = classesDeEquivalenciaPosterior;
			console.log(classesDeEquivalenciaAnterior);
			console.log(classesDeEquivalencia);
		} while (classesDeEquivalencia.length !== classesDeEquivalenciaAnterior.length);
		Utilitarios.paraCada(classesDeEquivalencia, function(classeDeEquivalencia) {
			var indice;
			for (indice = 1; indice < classeDeEquivalencia.length; indice++) {
				var estado = classeDeEquivalencia[indice];
				if (estado.inicial) {
					this.fixarEstadoInicial(nomeDoAutomato, classeDeEquivalencia[0].simbolo);
				}
				this.removerEstado(nomeDoAutomato, automato, estado);
			}
		}, this);
		return automatoDeterministico;
	},
	
	removerEstado: function(nomeDoAutomato, automato, estado) {
		if (automato.estadoInicial === estado) {
			automato.estadoInicial = automato.estados["!"];
		}
		Utilitarios.paraCada(automato.transicoes, function(estadoDaTransicao, chaveDoEstadoDaTransicao) {
			Utilitarios.paraCada(automato.transicoes[chaveDoEstadoDaTransicao], function(transicao, chaveDoSimboloDaTransicao) {
				var indice = transicao.estadosDeDestino.indexOf(estado);
				if (indice >= 0) {
					transicao.estadosDeDestino[indice] = automato.estados["!"];
				}
			});
		});
		if (estado.simbolo !== "!") {
			delete automato.estados[estado.simbolo];
			delete automato.transicoes[estado.simbolo];
			this.removerEstadoFinal(nomeDoAutomato, estado.simbolo);
		}
	},
	
	clonar: function(nomeDoAutomato, nomeDoClone) {
		var automato = ConjuntoDeAutomatosFinitos[nomeDoAutomato];
		var automatoClone = new AutomatoFinito();
		if (automato === undefined || ConjuntoDeAutomatosFinitos[nomeDoClone] !== undefined) {
			return false;
		}
		this.clonarEstados(automato, automatoClone);
		this.clonarSimbolos(automato, automatoClone);
		this.clonarTransicoesDeEstado(automato, automatoClone);
		if (nomeDoClone === undefined) {
			return automatoClone;
		}
		ConjuntoDeAutomatosFinitos[nomeDoClone] = automatoClone;
		return true;
	},
	
	clonarEstados: function(automato, automatoClone) {
		Utilitarios.paraCada(automato.estados, function(estado, chaveDoEstado) {
			automatoClone.estados[chaveDoEstado] = this.clonarEstado(estado);
		}, this);
		automatoClone.estadoInicial = automatoClone.estados[automato.estadoInicial];
		automatoClone.estadosFinais = [];
		Utilitarios.paraCada(automato.estadosFinais, function(estado, indice) {
			automatoClone.estadosFinais[indice] = automatoClone.estados[estado.simbolo];
		});
	},
	
	clonarSimbolos: function(automato, automatoClone) {
		Utilitarios.paraCada(automato.alfabeto, function(simbolo, chaveDoSimbolo) {
			automatoClone.alfabeto[chaveDoSimbolo] = this.clonarSimbolo(simbolo);
		}, this);
	},
	
	clonarTransicoesDeEstado: function(automato, automatoClone) {
		Utilitarios.paraCada(automato.estados, function(estado, chaveDoEstado) {
			automatoClone.transicoes[chaveDoEstado] = {};
			Utilitarios.paraCada(automato.alfabeto, function(simbolo, chaveDoSimbolo) {
				automatoClone.transicoes[chaveDoEstado][chaveDoSimbolo] = this.clonarTransicaoDeEstado(automato.transicoes[chaveDoEstado][chaveDoSimbolo], automatoClone);
			}, this);
		}, this);
	},
	
	clonarEstado: function (estado) {
		var novoEstado = new Estado(estado.simbolo);
		novoEstado.inicial = estado.inicial;
		novoEstado.final = estado.final;
		return novoEstado;
	},
	
	clonarSimbolo: function (simbolo) {
		return new Simbolo(simbolo.simbolo);
	},
	
	clonarTransicaoDeEstado: function (transicaoDeEstado, automatoClonado) {
		var estadoDeOrigemClonado = automatoClonado.estados[transicaoDeEstado.estadoDeOrigem.simbolo];
		var estadosDeDestinoClonado = [];
		Utilitarios.paraCada(transicaoDeEstado.estadosDeDestino, function(estadoDeDestino, chaveDoEstadoDeDestino) {
			estadosDeDestinoClonado.push(automatoClonado.estados[estadoDeDestino.simbolo]);
		});
		var simboloDeTransicaoClonado = automatoClonado.alfabeto[transicaoDeEstado.simboloDeTransicao.simbolo];
		var transicaoClonada = new TransicaoDeEstado(estadoDeOrigemClonado, estadosDeDestinoClonado, simboloDeTransicaoClonado);
		return transicaoClonada;
	}
};