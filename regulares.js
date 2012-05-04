ConjuntoDeAutomatosFinitos = {};

AutomatoFinito = new Prototipo({
	inicializar: function() {
		this.estados = {};
		this.alfabeto = {};
		this.estadosFinais = {};
		this.estadosIniciais = {};
		this.transicoes = [];
	}
});

TransicaoDeEstado = new Prototipo({
	inicializar: function(estadoDeOrigem, estadoDeDestino, simboloDeTransicao) {
		this.estadoDeOrigem = estadoDeOrigem;
		this.estadoDeDestino = estadoDeDestino;
		this.simboloDeTransicao = simboloDeTransicao;
	}
});

Estado = new Prototipo({
	inicializar: function(simbolo) {
		this.simbolo = simbolo;
	},
	
	toString: function() {
		return this.simbolo;
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

Regulares = {
	criarAutomatoFinito: function(nome) {
		if (ConjuntoDeAutomatosFinitos[nome] === undefined) {
			ConjuntoDeAutomatosFinitos[nome] = new AutomatoFinito();
			return true;
		} 
		return false;
	},
	
	fornecerAutomatoFinito: function(nome) {
		return ConjuntoDeAutomatosFinitos[nome];
	},
	
	adicionarEstadoDeAutomatoFinito: function(nomeDoAutomato, letraMaiuscula) {
		var automato = ConjuntoDeAutomatosFinitos[nomeDoAutomato];
		if (automato !== undefined) {
			return this.adicionarEstadoOuSimboloDeAutomatoFinito(automato.estados, /[A-Z]/, letraMaiuscula, Estado);
		}
		return false;
	},
	
	adicionarSimboloDeAutomatoFinito: function(nomeDoAutomato, letraMinuscula) {
		var automato = ConjuntoDeAutomatosFinitos[nomeDoAutomato];
		if (automato !== undefined) {
			return this.adicionarEstadoOuSimboloDeAutomatoFinito(automato.alfabeto, /[a-z]|[0-9]/, letraMinuscula, Simbolo);
		}
		return false;
	},
	
	adicionarEstadoOuSimboloDeAutomatoFinito: function(conjunto, expressaoRegular, simbolo, prototipo) {
		var avaliacaoDeExpressaoRegular = expressaoRegular.exec(simbolo);
		var estadoValido = (avaliacaoDeExpressaoRegular !== null && avaliacaoDeExpressaoRegular.length === 1);
		if (conjunto[simbolo] === undefined && estadoValido) {
			conjunto[simbolo] = new prototipo(simbolo);
			return true;
		}
		return false;
	}
};