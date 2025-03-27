// Variáveis para armazenar os custos de cada componente
var motor = 0;
var freio = 0;
var transmissao = 0;
var suspensao = 0;
var outros = 0;
var neon = 0;
var blindagem = 0;
var reparo = 0;
var helicoptero = 0;
var customizacao = 0;
var remap = 0;
var extraServices = [];
var extraTotal = 0;

let undoStack = [];
let redoStack = [];

// Adiciona um estado atual ao stack de undo
function saveState() {
    let currentState = {
        services: [...extraServices],  // Copia profunda do array de serviços
        // Adicione aqui outras propriedades do estado que você quer salvar
    };
    undoStack.push(currentState);
    // Limpa o stack de redo ao salvar um novo estado
    redoStack = [];
}

// Restaura um estado do stack de undo
function undo() {
    if (undoStack.length > 0) {
        // Salva o estado atual no stack de redo
        let currentState = {
            services: [...extraServices],
            // Adicione aqui outras propriedades do estado que você quer salvar
        };
        redoStack.push(currentState);

        // Restaura o estado anterior do stack de undo
        let previousState = undoStack.pop();
        extraServices = previousState.services;
        // Restaure aqui outras propriedades do estado

        atualizarCard();
        main();
    }
}

// Restaura um estado do stack de redo
function redo() {
    if (redoStack.length > 0) {
        // Salva o estado atual no stack de undo
        let currentState = {
            services: [...extraServices],
            // Adicione aqui outras propriedades do estado que você quer salvar
        };
        undoStack.push(currentState);

        // Restaura o próximo estado do stack de redo
        let nextState = redoStack.pop();
        extraServices = nextState.services;
        // Restaure aqui outras propriedades do estado

        atualizarCard();
        main();
    }
}

// Adiciona event listeners para os atalhos de teclado
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
    } else if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'Z' && event.shiftKey))) {
        event.preventDefault();
        redo();
    }
});


// Função para adicionar serviço extra
function addService() {
    let service = document.getElementById("extra-services").value.trim();
    let value = document.getElementById("extra-value").value.trim();
    
    // Remove o símbolo de moeda e converte para número inteiro
    value = value.replace(/[^0-9]/g, '');
    
    // Validar se o valor é um número inteiro
    if (service && value && /^\d+$/.test(value)) {
        // Salva o estado atual antes de adicionar o novo serviço
        saveState();
        
        let intValue = parseInt(value, 10);
        extraServices.push({service: service.toUpperCase(), value: intValue});
        atualizarCard();
        main();
        
        // Limpar os campos após adicionar
        document.getElementById("extra-services").value = '';
        document.getElementById("extra-value").value = '';
    }
}

function formatUpperCase(input) {
    input.value = input.value.toUpperCase();
}

function formatBRL(input) {
    let value = input.value.replace(/\D/g, ''); // Remove todos os caracteres que não são dígitos
    if (value) {
        let intValue = parseInt(value, 10);
        input.value = intValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });
    } else {
        input.value = '';
    }
}

function handleSubmit(event) {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário
    addService();
}

// Função principal que calcula o total e aplica o desconto
function main() {
    atualizarMotor();
    atualizarFreio();
    atualizarTransmissao();
    atualizarSuspensao();
    atualizarOutros();
    atualizarNeon();
    atualizarBlindagem();
    atualizarReparo();
    atualizarHelicoptero();
    atualizarCustomizacao();
    atualizarRemap();

    // Calcular total
    extraValues = extraServices.reduce((sum, item) => sum + item.value, 0);
    let total = motor + transmissao + suspensao + freio + outros + neon + blindagem + reparo + helicoptero + customizacao + remap + extraValues;

    // Event listeners para inputs de texto
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('input', atualizarCard);
        input.addEventListener('blur', atualizarCard); // Considerar também o evento blur
    });

    // Event listeners para inputs de radio e checkbox
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
        input.addEventListener('change', atualizarCard);
    });

    // Event listener para o campo 'desconto'
    document.getElementById('desconto').addEventListener('input', main);
    document.getElementById('desconto').addEventListener('input', atualizarCard);

    // Aplicar desconto se houver
    let descontoInput = document.getElementById("desconto").value;
    if (descontoInput && descontoInput >= 0 && descontoInput <= 100) {
        let descontoValor = total * (descontoInput / 100);
        total -= descontoValor;
        atualizarCard();
    }

    // Exibir total na interface sem centavos
    let totalP = document.getElementById("total");
    totalP.value = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0  // Configura para zero casas decimais (sem centavos)
    });
}

// Funções para atualizar os valores de cada componente
function atualizarMotor() {
    let motorCheck1 = document.getElementById("motor1");
    let motorCheck2 = document.getElementById("motor2");
    let motorCheck3 = document.getElementById("motor3");
    let motorCheck4 = document.getElementById("motor4");
    let motorCheck5 = document.getElementById("motor5");

    motor = 0;
    if (motorCheck1.checked) {
        motor += 20000;
    } else if (motorCheck2.checked) {
        motor += 40000;
    } else if (motorCheck3.checked) {
        motor += 70000;
    } else if (motorCheck4.checked) {
        motor += 100000;
    } else if (motorCheck5.checked) {
        motor += 130000;
    }
}

function atualizarFreio() {
    let freioCheck1 = document.getElementById("freio1");
    let freioCheck2 = document.getElementById("freio2");
    let freioCheck3 = document.getElementById("freio3");
    let freioCheck4 = document.getElementById("freio4");

    freio = 0;
    if (freioCheck1.checked) {
        freio += 20000;
    } else if (freioCheck2.checked) {
        freio += 60000;
    } else if (freioCheck3.checked) {
        freio += 60000;
    } else if (freioCheck4.checked) {
        freio += 90000;
    }
}

function atualizarTransmissao() {
    let transmissaoCheck1 = document.getElementById("trans1");
    let transmissaoCheck2 = document.getElementById("trans2");
    let transmissaoCheck3 = document.getElementById("trans3");
    let transmissaoCheck4 = document.getElementById("trans4");

    transmissao = 0;
    if (transmissaoCheck1.checked) {
        transmissao += 60000;
    } else if (transmissaoCheck2.checked) {
        transmissao += 80000;
    } else if (transmissaoCheck3.checked) {
        transmissao += 100000;
    } else if (transmissaoCheck4.checked) {
        transmissao += 130000;
    }
}

function atualizarSuspensao() {
    let suspensaoCheck1 = document.getElementById("sus1");
    let suspensaoCheck2 = document.getElementById("sus2");
    let suspensaoCheck3 = document.getElementById("sus3");
    let suspensaoCheck4 = document.getElementById("sus4");
    let suspensaoCheck5 = document.getElementById("sus5");

    suspensao = 0;
    if (suspensaoCheck1.checked) {
        suspensao += 20000;
    } else if (suspensaoCheck2.checked) {
        suspensao += 40000;
    } else if (suspensaoCheck3.checked) {
        suspensao += 70000;
    } else if (suspensaoCheck4.checked) {
        suspensao += 100000;
    } else if (suspensaoCheck5.checked) {
        suspensao += 130000;
    }
}

function atualizarOutros() {
    let outrosCheck1 = document.getElementById("outros1");
    let outrosCheck2 = document.getElementById("outros2");
    let outrosCheck3 = document.getElementById("outros3");

    outros = 0;
    if (outrosCheck1.checked) {
        outros += 1000000;
    } if (outrosCheck2.checked) {
        outros += 1500000;
    } if (outrosCheck3.checked) {
        outros += 400000;        
    }
}

function atualizarNeon() {
    let neonCheck1 = document.getElementById("neon1");
    let neonCheck2 = document.getElementById("neon2");
    let neonCheck3 = document.getElementById("neon3");
    let neonCheck4 = document.getElementById("neon4");

    neon = 0; // resetar o valor para garantir que o valor será recalculado
    if (neonCheck1.checked) {
        neon += 25000;
    }
    if (neonCheck2.checked) {
        neon += 25000;
    }
    if (neonCheck3.checked) {
        neon += 15000;
    }
    if (neonCheck4.checked) {
        neon += 15000;
    }
}

function atualizarBlindagem() {
    let blindagemCheck1 = document.getElementById("blind1");
    let blindagemCheck2 = document.getElementById("blind2");

    blindagem = 0; // resetar o valor para garantir que o valor será recalculado
    if (blindagemCheck1.checked) {
        blindagem += 900000;
    }
    if (blindagemCheck2.checked) {
        blindagem += 600000;
    }
}

function atualizarReparo() {
    let reparoCheck1 = document.getElementById("reparo1");
    let reparoCheck2 = document.getElementById("reparo2");
    let reparoCheck3 = document.getElementById("reparo3");

    reparo = 0; // resetar o valor para garantir que o valor será recalculado
    if (reparoCheck1.checked) {
        reparo += 5000;
    }
    if (reparoCheck2.checked) {
        reparo += 10000;
    }
    if (reparoCheck3.checked) {
        reparo += 15000;
    }
}

function atualizarHelicoptero() {
    let helicopteroCheck1 = document.getElementById("heli1");
    let helicopteroCheck2 = document.getElementById("heli2");
    let helicopteroCheck3 = document.getElementById("heli3");
    let helicopteroCheck4 = document.getElementById("heli4");
    let helicopteroCheck5 = document.getElementById("heli5");

    helicoptero = 0; // resetar o valor para garantir que o valor será recalculado
    if (helicopteroCheck1.checked) {
        helicoptero += 20000;
    }
    if (helicopteroCheck2.checked) {
        helicoptero += 20000;
    }
    if (helicopteroCheck3.checked) {
        helicoptero += 20000;
    }
    if (helicopteroCheck4.checked) {
        helicoptero += 20000;
    }
    if (helicopteroCheck5.checked) {
        helicoptero += 20000;
    }
}

function atualizarCustomizacao() {
    let customizacaoCheck1 = document.getElementById("custom01");
    let customizacaoCheck2 = document.getElementById("custom02");
    let customizacaoCheck3 = document.getElementById("custom03");
    let customizacaoCheck4 = document.getElementById("custom04");
    let customizacaoCheck5 = document.getElementById("custom05");
    let customizacaoCheck6 = document.getElementById("custom06");
    let customizacaoCheck7 = document.getElementById("custom07");
    let customizacaoCheck8 = document.getElementById("custom08");
    let customizacaoCheck9 = document.getElementById("custom09");
    let customizacaoCheck10 = document.getElementById("custom10");
    let customizacaoCheck11 = document.getElementById("custom11");
    let customizacaoCheck12 = document.getElementById("custom12");
    let customizacaoCheck13 = document.getElementById("custom13");
    let customizacaoCheck14 = document.getElementById("custom14");
    let customizacaoCheck15 = document.getElementById("custom15");
    let customizacaoCheck16 = document.getElementById("custom16");
    let customizacaoCheck17 = document.getElementById("custom17");
    let customizacaoCheck18 = document.getElementById("custom18");
    let customizacaoCheck19 = document.getElementById("custom19");
    let customizacaoCheck20 = document.getElementById("custom20");
    let customizacaoCheck21 = document.getElementById("custom21");
    let customizacaoCheck22 = document.getElementById("custom22");
    let customizacaoCheck23 = document.getElementById("custom23");
    let customizacaoCheck24 = document.getElementById("custom24");
    let customizacaoCheck25 = document.getElementById("custom25");
    let customizacaoCheck26 = document.getElementById("custom26");
    let customizacaoCheck27 = document.getElementById("custom27");

    customizacao = 0; // resetar o valor para garantir que o valor será recalculado
    if (customizacaoCheck1.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck2.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck3.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck4.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck5.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck6.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck7.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck8.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck9.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck10.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck11.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck12.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck13.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck14.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck15.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck16.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck17.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck18.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck19.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck20.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck21.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck22.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck23.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck24.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck25.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck26.checked) {
        customizacao += 10000;
    }
    if (customizacaoCheck27.checked) {
        customizacao += 10000;
    }
    
}

function atualizarRemap() {
    let remapCheck1 = document.getElementById("remap01");
    let remapCheck2 = document.getElementById("remap02");
    let remapCheck3 = document.getElementById("remap03");
    let remapCheck4 = document.getElementById("remap04");
    let remapCheck5 = document.getElementById("remap05");
    let remapCheck6 = document.getElementById("remap06");
    let remapCheck7 = document.getElementById("remap07");
    let remapCheck8 = document.getElementById("remap08");
    let remapCheck9 = document.getElementById("remap09");
    let remapCheck10 = document.getElementById("remap10");
    let remapCheck11 = document.getElementById("remap11");
    let remapCheck12 = document.getElementById("remap12");
    let remapCheck13 = document.getElementById("remap13");
    let remapCheck14 = document.getElementById("remap14");

    remap = 0; // resetar o valor para garantir que o valor será recalculado
    if (remapCheck1.checked) {
        remap += 150000;
    }
    if (remapCheck2.checked) {
        remap += 25000;
    }
    if (remapCheck3.checked) {
        remap += 25000;
    }
    if (remapCheck4.checked) {
        remap += 100000;
    }
    if (remapCheck5.checked) {
        remap += 75000;
    }
    if (remapCheck6.checked) {
        remap += 50000;
    }
    if (remapCheck7.checked) {
        remap += 50000;
    }
    if (remapCheck8.checked) {
        remap += 30000;
    }
    if (remapCheck9.checked) {
        remap += 75000;
    }
    if (remapCheck10.checked) {
        remap += 75000;
    }
    if (remapCheck11.checked) {
        remap += 100000;
    }
    if (remapCheck12.checked) {
        remap += 100000;
    }
    if (remapCheck13.checked) {
        remap += 100000;
    }
    if (remapCheck14.checked) {
        remap += 955000;
    }
}



// Função para limpar ou marcar todos os inputs de um grupo
function limpaOuMarca(nome) {
    const inputs = document.querySelectorAll(`input[name="${nome}"]`);
    const isCheckbox = inputs[0].type === 'checkbox';
    const qualquerMarcado = Array.from(inputs).some(input => input.checked);

    inputs.forEach(input => {
        if (isCheckbox) {
            input.checked = !qualquerMarcado;
        } else {
            if (!qualquerMarcado) {
                input.checked = true;
            } else {
                input.checked = false;
            }
        }
    });

    const acao = qualquerMarcado ? "desmarcada" : "marcada";
    console.log(`Seleção de ${nome.toUpperCase()} ${acao}.`);
    main(); 
    atualizarCard();
}

// Funções para limpar seleção de cada grupo
function limpaMotor() {
    limpaOuMarca("motor");
    atualizarCard();
}

function limpaFreio() {
    limpaOuMarca("freio");
    atualizarCard();
}

function limpaTrans() {
    limpaOuMarca("trans");
    atualizarCard();
}

function limpaSus() {
    limpaOuMarca("sus");
    atualizarCard();
}

function limpaOutros() {
    limpaOuMarca("outros");
    atualizarCard();
}

function limpaNeon() {
    limpaOuMarca("neon");
    atualizarCard();
}

function limpaBlind() {
    limpaOuMarca("blind");
    atualizarCard();
}

function limpaReparo() {
    limpaOuMarca("reparo");
    atualizarCard();
}

function limpaHeli() {
    limpaOuMarca("heli");
    atualizarCard();
}

function limpaCustom() {
    limpaOuMarca("custom");
    atualizarCard();
}

function limpaRemap() {
    limpaOuMarca("remap");
    atualizarCard();
}

// Event listeners para botões de limpeza/marcação
document.getElementById("limpaMotor").addEventListener("click", limpaMotor);
document.getElementById("limpaFreio").addEventListener("click", limpaFreio);
document.getElementById("limpaTrans").addEventListener("click", limpaTrans);
document.getElementById("limpaSus").addEventListener("click", limpaSus);
document.getElementById("limpaOutros").addEventListener("click", limpaOutros);
document.getElementById("limpaNeon").addEventListener("click", limpaNeon);
document.getElementById("limpaBlind").addEventListener("click", limpaBlind);
document.getElementById("limpaReparo").addEventListener("click", limpaReparo);
document.getElementById("limpaHeli").addEventListener("click", limpaHeli);
document.getElementById("limpaCustom").addEventListener("click", limpaCustom);
document.getElementById("limpaRemap").addEventListener("click", limpaRemap);


// Limpar todos os checkboxes e radios
document.querySelectorAll('input[type=checkbox], input[type=radio]').forEach(input => input.checked = false);
console.log("Todas as seleções foram limpas.");
main(); 

// Função para limpar tudo
function limpaTudo() {
    limpaMotor();
    limpaFreio();
    limpaTrans();
    limpaSus();
    limpaOutros();
    limpaNeon();
    limpaBlind();
    limpaReparo();
    limpaHeli();
    limpaCustom();
    limpaRemap();
    limparService();
    console.log("Todas as seleções foram limpas.");
}


// Atualizar o botão "LIMPAR" para chamar a função limpaTudo
document.getElementById("botaoLimpar").setAttribute("onclick", "limpaTudo()");

// Função para limpar todos os checkboxes e radios e a ficha de serviço
function limpaTudo() {
    // Limpar todos os checkboxes e radios
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(input => input.checked = false);

    // Limpar os campos de texto
    document.getElementById("nome").value = '';
    document.getElementById("id").value = '';
    document.getElementById("placa").value = '';
    document.getElementById("desconto").value = '';

    // Limpar os campos da ficha de serviço
    document.getElementById("Card-nome").textContent = '';
    document.getElementById("Card-id").textContent = '';
    document.getElementById("Card-placa").textContent = '';
    document.getElementById("Card-motor").textContent = '';
    document.getElementById("Card-freio").textContent = '';
    document.getElementById("Card-trans").textContent = '';
    document.getElementById("Card-sus").textContent = '';
    document.getElementById("Card-outros").textContent = '';
    document.getElementById("Card-neon").textContent = '';
    document.getElementById("Card-blind").textContent = '';
    document.getElementById("Card-reparo").textContent = '';
    document.getElementById("Card-heli").textContent = '';
    document.getElementById("Card-custom").textContent = '';
    document.getElementById("Card-remap").textContent = '';
    document.getElementById("Card-extra").textContent = '';
    document.getElementById("Card-desconto").textContent = '';
    document.getElementById("Card-total").textContent = '';

    limparService(); // Adicionar esta linha para limpar os serviços extras

    console.log("Todas as seleções foram limpas.");
    main(); // Recalcular o total após limpar
    atualizarCard();
}

// Event listener para o botão Limpar Tudo
document.getElementById("limparTudo").addEventListener("click", limpaTudo);

// Event listener para o botão Limpar Tudo
document.getElementById("limparTudo").addEventListener("click", limpaTudo);

// Função para limpar os serviços extras
function limparService() {
    extraServices = [];
    extraTotal = 0;
    document.getElementById("Card-extra").textContent = "";
    main();
}

// Event listener para o botão AddService
document.getElementById("AddService").addEventListener("click", addService);

// Event listener para o botão CleanService
document.getElementById("cleanService").addEventListener("click", limparService);





// Função para atualizar o card com os dados dos inputs
function atualizarCard() {
    let nome = document.getElementById("nome").value.trim();
    let id = document.getElementById("id").value.trim();
    let placa = document.getElementById("placa").value.trim().toUpperCase();
    let desconto = document.getElementById("desconto").value.trim();
    let total = document.getElementById("total").value.trim();

    // Função para capitalizar a primeira letra de cada palavra
    function capitalize(str) {
        return str.toLowerCase().replace(/(?:^|\s)\S/g, function(a) {
            return a.toUpperCase();
        });
    }

    function coletarItensSelecionados(nome) {
        const inputs = document.querySelectorAll(`input[name="${nome}"]:checked`);
        const itensSelecionados = Array.from(inputs).map(input => {
            const label = input.closest('label');
            const spanElement = label.querySelector('span');
            return spanElement.textContent.trim();
        });
        return itensSelecionados.join(', ');
    }

    document.getElementById("Card-nome").textContent = capitalize(nome);
    document.getElementById("Card-id").textContent = id;
    document.getElementById("Card-placa").textContent = placa;
    document.getElementById("Card-motor").textContent = coletarItensSelecionados('motor');
    document.getElementById("Card-freio").textContent = coletarItensSelecionados('freio');
    document.getElementById("Card-trans").textContent = coletarItensSelecionados('trans');
    document.getElementById("Card-sus").textContent = coletarItensSelecionados('sus');
    document.getElementById("Card-outros").textContent = coletarItensSelecionados('outros');
    document.getElementById("Card-neon").textContent = coletarItensSelecionados('neon');
    document.getElementById("Card-blind").textContent = coletarItensSelecionados('blind');
    document.getElementById("Card-reparo").textContent = coletarItensSelecionados('reparo');
    document.getElementById("Card-heli").textContent = coletarItensSelecionados('heli');
    document.getElementById("Card-custom").textContent = coletarItensSelecionados('custom');
    document.getElementById("Card-remap").textContent = coletarItensSelecionados('remap');

    // Adicionar serviços extras ao Card
    let extraServicesText = extraServices.map(item => `${item.service}: R$ ${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`).join(', ');
    document.getElementById("Card-extra").textContent = extraServicesText;

    document.getElementById("Card-desconto").textContent = desconto;
    document.getElementById("Card-total").textContent = total;
}


// Inicializar a interface com os event listeners
document.addEventListener("DOMContentLoaded", function() {
    // Event listeners para os botões e inputs
    document.querySelectorAll('input[name="motor"]').forEach(input => {
        input.addEventListener('change', atualizarCard);
    });

    document.querySelectorAll('input[name="freio"]').forEach(input => {
        input.addEventListener('change', atualizarCard);
    });

    document.querySelectorAll('input[name="trans"]').forEach(input => {
        input.addEventListener('change', atualizarCard);
    });

    document.querySelectorAll('input[name="sus"]').forEach(input => {
        input.addEventListener('change', atualizarCard);
    });

    document.querySelectorAll('input[name="outros"]').forEach(input => {
        input.addEventListener('change', atualizarCard);
    });

    document.querySelectorAll('input[name="neon"]').forEach(input => {
        input.addEventListener('change', atualizarCard);
    });

    document.querySelectorAll('input[name="blind"]').forEach(input => {
        input.addEventListener('change', atualizarCard);
    });

    document.querySelectorAll('input[name="reparo"]').forEach(input => {
        input.addEventListener('change', atualizarCard);
    });

    document.querySelectorAll('input[name="heli"]').forEach(input => {
        input.addEventListener('change', atualizarCard);
    });

    document.querySelectorAll('input[name="custom"]').forEach(input => {
        input.addEventListener('change', atualizarCard);
    });

    document.querySelectorAll('input[name="remap"]').forEach(input => {
        input.addEventListener('change', atualizarCard);
    });

    document.getElementById("desconto").addEventListener("input", atualizarCard);
    document.getElementById("nome").addEventListener("input", atualizarCard);
    document.getElementById("id").addEventListener("input", atualizarCard);
    document.getElementById("placa").addEventListener("input", atualizarCard);
    document.getElementById("AddService").addEventListener("click", addService);
    document.getElementById("cleanService").addEventListener("click", limparService);
    document.getElementById("limparTudo").addEventListener("click", limpaTudo);

    atualizarCard(); // Atualizar o card na inicialização
});

// Event listener para o botão AddService
document.getElementById("AddService").addEventListener("click", addService);

// Event listeners para inputs de texto
document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', main);
    input.addEventListener('blur', main); // Considerar também o evento blur
});

// Event listeners para inputs de radio e checkbox
document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', main);
});

// Event listener para o campo "desconto"
document.getElementById("desconto").addEventListener("input", atualizarCard);
// Event listener para o campo 'desconto'
document.getElementById('desconto').addEventListener('input', main);

// Chamar main() inicialmente para calcular e exibir o total
main();





// Função para copiar a Ficha de Serviço
function copiarServico() {
    atualizarCard(); // Certifica-se de que o card está atualizado antes de copiar

    // Função para capitalizar uma string
    function capitalize(str) {
        // Separa a string em palavras
        let words = str.toLowerCase().split(' ');

        // Capitaliza a primeira letra de cada palavra
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
        }

        // Junta as palavras novamente em uma string
        return words.join(' ');
    }

    function coletarItensSelecionados(nome) {
        const inputs = document.querySelectorAll(`input[name="${nome}"]:checked`);
        const itensSelecionados = Array.from(inputs).map(input => {
            const label = input.closest('label');
            const spanElement = label.querySelector('span');
            return spanElement.textContent.trim();
        });
        return itensSelecionados.join(', ');
    }

    let nome = capitalize(document.getElementById("nome").value.trim());
    let id = document.getElementById("id").value.trim();
    let placa = document.getElementById("placa").value.trim().toUpperCase();
    let desconto = document.getElementById("desconto").value.trim();
    let total = document.getElementById("total").value.trim();

    let textoCopiado = `# 𝗙𝗜𝗖𝗛𝗔 𝗗𝗘 𝗦𝗘𝗥𝗩𝗜𝗖̧𝗢\n`;

    // Incluir campos obrigatórios independentemente de estarem vazios
    textoCopiado += `𝗡𝗢𝗠𝗘: ${nome}\n`;
    textoCopiado += `𝗜𝗗: ${id}\n`;
    textoCopiado += `𝗣𝗟𝗔𝗖𝗔: ${placa}\n\n`;

    // Incluir serviços selecionados
    const servicos = [
        { nome: '𝗠𝗢𝗧𝗢𝗥', valor: coletarItensSelecionados('motor') },
        { nome: '𝗙𝗥𝗘𝗜𝗢', valor: coletarItensSelecionados('freio') },
        { nome: '𝗧𝗥𝗔𝗡𝗦𝗠𝗜𝗦𝗦𝗔̃𝗢', valor: coletarItensSelecionados('trans') },
        { nome: '𝗦𝗨𝗦𝗣𝗘𝗡𝗦𝗔̃𝗢', valor: coletarItensSelecionados('sus') },
        { nome: '𝗢𝗨𝗧𝗥𝗢𝗦', valor: coletarItensSelecionados('outros') },
        { nome: '𝗡𝗘𝗢𝗡', valor: coletarItensSelecionados('neon') },
        { nome: '𝗕𝗟𝗜𝗡𝗗𝗔𝗚𝗘𝗠', valor: coletarItensSelecionados('blind') },
        { nome: '𝗥𝗘𝗣𝗔𝗥𝗢', valor: coletarItensSelecionados('reparo') },
        { nome: '𝗛𝗘𝗟𝗜𝗖𝗢́𝗣𝗧𝗘𝗥𝗢', valor: coletarItensSelecionados('heli') },
        { nome: '𝗖𝗨𝗦𝗧𝗢𝗠𝗜𝗭𝗔𝗖̧𝗔̃𝗢', valor: coletarItensSelecionados('custom') },
        { nome: '𝗥𝗘𝗠𝗔𝗣', valor: coletarItensSelecionados('remap') },
    ];

    servicos.forEach(servico => {
        if (servico.valor) {
            textoCopiado += `${servico.nome}: ${servico.valor}\n`;
        }
    });

    // Incluir serviços extras
    if (extraServices.length > 0) {
        textoCopiado += `𝗦𝗘𝗥𝗩𝗜𝗖̧𝗢𝗦 𝗘𝗫𝗧𝗥𝗔𝗦: `;
        extraServices.forEach(extra => {
            textoCopiado += `${extra.service}: ${extra.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0  })}, `;
        });
        textoCopiado += '\n';
    }

    // Incluir desconto e total se existirem
    textoCopiado += `\n𝗗𝗘𝗦𝗖𝗢𝗡𝗧𝗢: ${desconto}%\n`;
    textoCopiado += `𝗧𝗢𝗧𝗔𝗟: ${total}`;

    navigator.clipboard.writeText(textoCopiado)
        .then(() => {
            console.log('Texto copiado para a área de transferência.');
            alert('SERVIÇO COPIADO COM SUCESSO! ✅ CLIQUE EM CTRL + V OU WINDOWS + V PARA COLAR O SERVIÇO REGISTRADO. 🧑🏻‍🔧 REGISTRE O SERVIÇO NO DISCORD. 📄 Feito por : ALWAY - L ( LP ) e ADM RYIOKI.');
        })
        .catch(err => {
            console.error('Erro ao copiar texto para a área de transferência: ', err);
            alert('Erro ao copiar serviço para a área de transferência.');
        });
}






// Event listeners para inputs, radio buttons, checkboxes e textos
document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', atualizarCard);
    input.addEventListener('blur', atualizarCard); // Adicionando o evento blur
});

document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', atualizarCard);
});


// Event listener para o botão Copiar Serviço
document.getElementById("copiarServico").addEventListener("click", copiarServico);


function validarDesconto(input) {
    let valor = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    valor = parseInt(valor); // Converte para número

    // Verifica se o valor não é um número válido ou está vazio
    if (isNaN(valor) || valor === '') {
        valor = 0; // Define como 0 se for NaN ou vazio
    } else {
        valor = Math.min(valor, 100); // Garante que o valor não seja maior que 100
    }

    input.value = valor; // Atualiza o valor no campo
}



function redirectToCalculator() {
    // Redireciona para a página inicial da Calculadora Penal
    window.location.href = 'https://calculadoramec.netlify.app';
}


    // Função para abrir o modal
    function openModal() {
        var modal = document.getElementById('modal');
        var modalContent = document.getElementById('modalContent');
        modal.style.display = 'block';
        setTimeout(function() {
            modalContent.classList.add('open');
        }, 100); // Pequeno atraso para permitir a transição
    }

    // Função para fechar o modal ao clicar fora dele
    function closeModal(event) {
        var modal = document.getElementById('modal');
        var modalContent = document.getElementById('modalContent');
        var closeButton = document.querySelector('.close-custom');
        
        if (event.target === modal || event.target === closeButton) {
            modalContent.classList.remove('open');
            setTimeout(function() {
                modal.style.display = 'none';
            }, 100); // Espera a transição completar antes de esconder o modal
        }
    }

