interface Veiculo{
    nome: string;
    placa: string;
    entrada: string;
    entradaformatada: string;
}

(function () {

    const $ = (query: string): HTMLInputElement  | null => document.querySelector(query);
    
    function calcTempo(mil: number){
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000)/ 1000 );

        return `${min}m e ${sec}s`;
    }
    function Patio(){

        function ler(): Veiculo[]{
            return localStorage.Patio? JSON.parse(localStorage.Patio) : []

        }

        function adicionar(veiculo: Veiculo, salva?:boolean){
            const row = document.createElement('tr');

            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entradaformatada}</td>
            <td>
                <button class="delete" data-placa="${veiculo.placa}">X</button>
            </td>
            `;

            row.querySelector(".delete")?.addEventListener('click', function(){
                remover(this.dataset.placa);
            })

            $('#patio')?.appendChild(row)

            if(salva) salvar([...ler(), veiculo]);
        }

        function remover(placa:string){

            const { entrada, nome} = ler().find((veiculo) => veiculo.placa === placa);

            const entradaDate = new Date(entrada)

            const time = calcTempo(new Date().getTime() - entradaDate.getTime());

            if(
                !confirm(`O veiculo ${nome} permaneceu por ${time}. Deseja encerrar?`)
            
              )

                return;

            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();

        }

        function salvar(veiculos: Veiculo[]){
            localStorage.setItem('Patio', JSON.stringify(veiculos))
        }

        function render(){
            $("#patio")!.innerHTML = '';

            const patio = ler();

            if(patio.length){
                patio.forEach(( veiculo ) => adicionar(veiculo));

        }

    }

        return {ler, adicionar, remover, salvar, render};
    }

    Patio().render();

    $('#cadastrar')?.addEventListener('click', () => {
       const nome = $('#nome')?.value;
       const placa = $('#placa')?.value;

       if( !nome || !placa){
           alert('Os campos nome e placa sao obrigatorios');
           return;
       }

       const dataFormatada = new Date().toLocaleString('pt-BR', {
           day: '2-digit',
           month: '2-digit',
           year: 'numeric',
           hour: '2-digit',
           minute: '2-digit',
         });

        const dataEntrada = new Date();

       Patio().adicionar({
           nome,
           placa,
           entrada: dataEntrada.toISOString(),
           entradaformatada: dataFormatada    
       }, true); 

        $('#nome')!.value = '';
        $('#placa')!.value = '';
    })

})();