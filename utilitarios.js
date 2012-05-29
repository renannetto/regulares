Utilitarios = { 
	implementar: function(prototipo, implementacoes) {
		prototipo.implementar(implementacoes);
	},
	
	instanciaDe: function(objeto, tipo) {
		return (objeto instanceof tipo);
	},
	
	paraCada: function(iteravel, funcaoDeIteracao, escopo) {
		if (!(this.instanciaDe(iteravel, Object) || this.instanciaDe(iteravel, String)) || !this.instanciaDe(funcaoDeIteracao, Function)) {
			throw new ExcecaoUtilitarios("Argumento inválido. Argumentos devem ser: [Objeto ou Lista] [Função].");
		}
		funcaoDeIteracao = funcaoDeIteracao.bind(escopo);
		for (var chave in iteravel) {
			funcaoDeIteracao(iteravel[chave], chave);
		}
	} 
};

Prototipo = function Prototipo(corpoDoPrototipo) {
	var novoPrototipo = function Objeto() {
		if (this.inicializar !== undefined) {
			this.inicializar.apply(this, arguments);
		}
	};
	novoPrototipo.implementar(corpoDoPrototipo);
	return novoPrototipo;
};

Function.prototype.implementar = function(implementacoes) {
	if (!Utilitarios.instanciaDe(implementacoes, Object)) {
		throw new ExcecaoUtilitarios("Argumento inválido. Argumento deve ser: [ObjetoJson].");
	}
	Utilitarios.paraCada(implementacoes, function(implementacao, chave) {
		this.prototype[chave] = implementacao;
	}, this);
};

ExcecaoUtilitarios = new Prototipo({
	inicializar: function(mensagem) {
		this.mensagem = mensagem;
	},
	
	fornecerComoTexto: function() {
		return "ExcecaoUtilitarios: " + this.mensagem;
	},
	
	toString: function() {
		return this.fornecerComoTexto();
	}
});