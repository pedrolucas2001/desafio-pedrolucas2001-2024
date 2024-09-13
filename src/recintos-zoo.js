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

    const recintosViaveis = [];

    this.recintos.forEach(recinto => {
        if (this.recintoEhViavel(recinto, infoAnimal, espacoNecessario)) {
            const espacoOcupado = this.calcularEspacoOcupado(recinto, tipoAnimal);
            const espacoLivre = recinto.tamanho - espacoOcupado;

            if (espacoLivre >= espacoNecessario) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoLivre - espacoNecessario} total: ${recinto.tamanho})`);
            }
        }
    });

    if (recintosViaveis.length === 0) {
        return { erro: "Não há recinto viável" };
    }

    return { recintosViaveis };
}

calcularEspacoOcupado(recinto, novoAnimal) {
    let espacoOcupado = 0;

    // Calcular o espaço ocupado pelos animais no recinto
    recinto.animais.forEach(animal => {
        const infoAnimal = this.animaisInfo[animal.toLowerCase()];
        if (infoAnimal) {
            espacoOcupado += infoAnimal.tamanho;
        }
    });

    // Adicionar o novo animal adicionado na lista de animais existentes
    const especies = new Set(recinto.animais.map(animal => animal.toLowerCase()));

    if (typeof novoAnimal === 'string') {
        especies.add(novoAnimal.toLowerCase());
    }

        // Adicionar 1 espaço ocupado quando possui mais de uma espécie no recinto
    if (especies.size > 1) {
        espacoOcupado += 1; 
    }

    return espacoOcupado;
}

    recintoEhViavel(recinto, infoAnimal, espacoNecessario) {
        if (!this.biomaEhCompativel(recinto.bioma, infoAnimal.bioma)) {
            return false;
        }

        const espacoOcupado = this.calcularEspacoOcupado(recinto);
        if ((recinto.tamanho - espacoOcupado) < espacoNecessario) {
            return false;
        }

        return this.verificaCompatibilidadeComAnimaisExistentes(recinto, infoAnimal);
    }

    biomaEhCompativel(biomaRecinto, biomasAnimal) {
        if (Array.isArray(biomasAnimal)) {
            return biomasAnimal.some(bioma => biomaRecinto.includes(bioma)); // Verifica se o bioma inclui qualquer compatível
        }
        return biomaRecinto.includes(biomasAnimal);
    }

    verificaCompatibilidadeComAnimaisExistentes(recinto, infoAnimal) {
        return recinto.animais.every(animal => {
            const infoExistente = this.animaisInfo[animal.toLowerCase()];
            return !(infoAnimal.carnivoro && infoExistente.carnivoro) && (infoAnimal.carnivoro === infoExistente.carnivoro);
        });
    }
}

const zoo = new RecintosZoo().analisaRecintos('MACACO', 2);
console.log(zoo);

export { RecintosZoo as RecintosZoo };
