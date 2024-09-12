class RecintosZoo {

    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: ['macaco', 'macaco', 'macaco'] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: ['gazela'] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: ['leao'] }
        ];

        this.animaisInfo = {
            'leao': { tamanho: 3, bioma: 'savana', carnivoro: true },
            'leopardo': { tamanho: 2, bioma: 'savana', carnivoro: true },
            'crocodilo': { tamanho: 3, bioma: 'rio', carnivoro: true },
            'macaco': { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            'gazela': { tamanho: 2, bioma: 'savana', carnivoro: false },
            'hipopotamo': { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(tipoAnimal, quantidade) {
        if (!this.animaisInfo[tipoAnimal.toLowerCase()]) {
            return { erro: "Animal inválido" };
        }
    
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: "Quantidade inválida" };
        }
    
        const infoAnimal = this.animaisInfo[tipoAnimal.toLowerCase()];
        let espacoNecessario = infoAnimal.tamanho * quantidade;
    
        if (quantidade > 1) {
            espacoNecessario += 1;
        }
    
        const recintosViaveis = [];
    
        this.recintos.forEach(recinto => {
            if (this.recintoEhViavel(recinto, infoAnimal, espacoNecessario)) {
                const espacoOcupado = this.calcularEspacoOcupado(recinto);
                const espacoLivre = recinto.tamanho - espacoOcupado;
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanho})`);
            }
        });
    
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }
    
        return { recintosViaveis };
    }
    
    recintoEhViavel(recinto, infoAnimal, espacoNecessario) {
        if (!this.biomaEhCompativel(recinto.bioma, infoAnimal.bioma)) {
            return false;
        }

        const espacoOcupado = this.calcularEspacoOcupado(recinto);
        if (recinto.tamanho - espacoOcupado < espacoNecessario) {
            return false;
        }

        return this.verificaCompatibilidadeComAnimaisExistentes(recinto, infoAnimal);
    }

    biomaEhCompativel(biomaRecinto, biomasAnimal) {
        if (Array.isArray(biomasAnimal)) {
            return biomasAnimal.includes(biomaRecinto);
        }
        return biomaRecinto === biomasAnimal;
    }

   calcularEspacoOcupado(recinto) {
    let espacoOcupado = 0;

    // Calcula o espaço ocupado pelos animais no recinto
    recinto.animais.forEach(animal => {
        const infoAnimal = this.animaisInfo[animal.toLowerCase()]; // Corrige para minúsculo
        if (infoAnimal) {
            espacoOcupado += infoAnimal.tamanho;
        }
    });

    // Adiciona espaço extra se houver mais de uma espécie
    const especies = [];
    recinto.animais.forEach(animal => {
        const infoAnimal = this.animaisInfo[animal.toLowerCase()]; // Corrige para minúsculo
        if (infoAnimal && !especies.includes(infoAnimal.bioma)) {
            especies.push(infoAnimal.bioma);
        }
    });

    if (especies.length > 1) {
        espacoOcupado += 1; // Espaço extra por mais de uma espécie
    }

    return espacoOcupado;
}



    verificaCompatibilidadeComAnimaisExistentes(recinto, infoAnimal) {
        return recinto.animais.every(animal => {
            const infoExistente = this.animaisInfo[animal.toLowerCase()];
            return !(infoAnimal.carnivoro && infoExistente.carnivoro && infoAnimal.bioma !== infoExistente.bioma);
        });
    }
}

export { RecintosZoo as RecintosZoo };
