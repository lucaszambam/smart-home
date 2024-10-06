import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:4000');

// Definir interface para o estado dos dispositivos em cada cômodo
interface EstadoDispositivos {
    sala: {
        luzOn: boolean;
        tvOn: boolean;
        canalAtual: number;
        arCondicionadoOn: boolean;
        temperatura: number;
    };
    cozinha: {
        luzOn: boolean;
        geladeiraTemperatura: number;
        alertaGeladeira: boolean;
        fogaoOn: boolean;
        fogaoPotencia: number;
    };
    quarto: {
        luzOn: boolean;
        ventiladorOn: boolean;
        ventiladorVelocidade: number;
        cortinasAbertas: boolean;
    };
}

const App: React.FC = () => {
    const [dispositivos, setDispositivos] = useState<EstadoDispositivos>({
        sala: {
            luzOn: false,
            tvOn: false,
            canalAtual: 1,
            arCondicionadoOn: false,
            temperatura: 24,
        },
        cozinha: {
            luzOn: false,
            geladeiraTemperatura: 4,
            alertaGeladeira: false,
            fogaoOn: false,
            fogaoPotencia: 1,
        },
        quarto: {
            luzOn: false,
            ventiladorOn: false,
            ventiladorVelocidade: 1,
            cortinasAbertas: false,
        },
    });

    // Conectar ao backend e receber o estado inicial
    useEffect(() => {
        socket.on('estadoInicial', (estadoDispositivos: EstadoDispositivos) => {
            setDispositivos(estadoDispositivos);
        });

        // Atualiza estado quando houver mudança
        socket.on('estadoAltera', (novoEstado: EstadoDispositivos) => {
            setDispositivos(novoEstado);
        });

        return () => {
            socket.off('estadoInicial');
            socket.off('estadoAltera');
        };
    }, []);

    // Funções para manipular dispositivos por cômodo
    const acenderLuzSala = () => {
        socket.emit('acenderLuzSala');
    };

    const controlarTv = () => {
        socket.emit('controlarTv', dispositivos.sala.canalAtual === 3 ? 1 : dispositivos.sala.canalAtual + 1);
    };

    const ajustarArCondicionado = () => {
        const novaTemperatura = dispositivos.sala.temperatura === 30 ? 18 : dispositivos.sala.temperatura + 1;
        socket.emit('ajustarArCondicionado', novaTemperatura);
    };

    const acenderLuzCozinha = () => {
        socket.emit('acenderLuzCozinha');
    };

    const ajustarFogao = () => {
        const novaPotencia = dispositivos.cozinha.fogaoPotencia === 5 ? 1 : dispositivos.cozinha.fogaoPotencia + 1;
        socket.emit('ajustarFogao', novaPotencia);
    };

    const acenderLuzQuarto = () => {
        socket.emit('acenderLuzQuarto');
    };

    const ajustarVentilador = () => {
        const novaVelocidade = dispositivos.quarto.ventiladorVelocidade === 3 ? 1 : dispositivos.quarto.ventiladorVelocidade + 1;
        socket.emit('ajustarVentilador', novaVelocidade);
    };

    const controlarCortinas = () => {
        socket.emit('controlarCortinas');
    };

    return (
        <div className='casa'>
            <h1>Casa Inteligente</h1>

            <div className='comodo'>
                <h2>Sala de Estar</h2>
                <div className="options">
                    <button onClick={acenderLuzSala}>
                        {dispositivos.sala.luzOn ? 'Desligar Luz' : 'Ligar Luz'}
                    </button>
                    <button onClick={controlarTv}>
                        {dispositivos.sala.tvOn ? `Desligar TV (Canal ${dispositivos.sala.canalAtual})` : 'Ligar TV'}
                    </button>
                    <button onClick={ajustarArCondicionado}>
                        {dispositivos.sala.arCondicionadoOn ? `Ajustar Ar (Temp: ${dispositivos.sala.temperatura}°C)` : 'Ligar Ar-Condicionado'}
                    </button>

                    <div className='feedback'>
                        <img src='imgs\luz.png' className={`lampada status ${dispositivos.sala.luzOn ? 'on' : 'off'}`} />
                    </div>
                </div>
            </div>

            <div className='comodo'>
                <h2>Cozinha</h2>
                <div className="options">
                    <button onClick={acenderLuzCozinha}>
                        {dispositivos.cozinha.luzOn ? 'Desligar Luz' : 'Ligar Luz'}
                    </button>
                    <button onClick={ajustarFogao}>
                        {dispositivos.cozinha.fogaoOn ? `Desligar Fogão (Potência: ${dispositivos.cozinha.fogaoPotencia})` : 'Ligar Fogão'}
                    </button>
                </div>
                <div className='feedback'>
                    <p>Temperatura da Geladeira: {dispositivos.cozinha.geladeiraTemperatura}°C</p>
                    {dispositivos.cozinha.alertaGeladeira && <p className='alerta'>Alerta: Temperatura alta!</p>}
                    <img src='imgs\luz.png' className={`lampada status ${dispositivos.cozinha.luzOn ? 'on' : 'off'}`} />
                </div>
            </div>

            <div className='comodo'>
                <h2>Quarto</h2>
                <div className="options">
                    <button onClick={acenderLuzQuarto}>
                        {dispositivos.quarto.luzOn ? 'Desligar Luz' : 'Ligar Luz'}
                    </button>
                    <button onClick={ajustarVentilador}>
                        {dispositivos.quarto.ventiladorOn ? `Ajustar Ventilador (Velocidade: ${dispositivos.quarto.ventiladorVelocidade})` : 'Ligar Ventilador'}
                    </button>
                    <button onClick={controlarCortinas}>
                        {dispositivos.quarto.cortinasAbertas ? 'Fechar Cortinas' : 'Abrir Cortinas'}
                    </button>
                </div>
                <div className='feedback'>
                    <img src='imgs\luz.png' className={`lampada status ${dispositivos.quarto.luzOn ? 'on' : 'off'}`} />
                </div>
            </div>
        </div>
    );
};

export default App;
