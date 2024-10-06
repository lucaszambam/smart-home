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

    const ligarTvSala = () => {
        socket.emit('ligarTvSala');
    }

    const controlarTv = () => {
        socket.emit('controlarTv', dispositivos.sala.canalAtual === 3 ? 1 : dispositivos.sala.canalAtual + 1);
    };

    const ligarArCondicionado = () => {
        socket.emit('ligarArCondicionado');
    };

    const ajustarArCondicionado = () => {
        const novaTemperatura = dispositivos.sala.temperatura === 30 ? 18 : dispositivos.sala.temperatura + 1;
        socket.emit('ajustarArCondicionado', novaTemperatura);
    };

    const acenderLuzCozinha = () => {
        socket.emit('acenderLuzCozinha');
    };

    const ligarFogao = () => {
        socket.emit('ligarFogao');
    }

    const ajustarFogao = () => {
        const novaPotencia = dispositivos.cozinha.fogaoPotencia === 5 ? 1 : dispositivos.cozinha.fogaoPotencia + 1;
        socket.emit('ajustarFogao', novaPotencia);
    };

    const acenderLuzQuarto = () => {
        socket.emit('acenderLuzQuarto');
    };

    const ligarVentilador = () => {
        socket.emit('ligarVentilador');
    }

    const ajustarVentilador = () => {
        const novaVelocidade = dispositivos.quarto.ventiladorVelocidade === 3 ? 1 : dispositivos.quarto.ventiladorVelocidade + 1;
        socket.emit('ajustarVentilador', novaVelocidade);
    };

    const controlarCortinas = () => {
        socket.emit('controlarCortinas');
    };

    return (
        <div className='casa'>
            <h1>Smart Home Controller</h1>

            <div className='comodos'>
                <div className='comodo'>
                    <h2>Sala de Estar</h2>
                    <div className="options">
                        <button onClick={acenderLuzSala} style={{ width: '91px' }}>
                            {dispositivos.sala.luzOn ? 'Desligar Luz' : 'Ligar Luz'}
                        </button>
                        <button onClick={ligarTvSala}>
                            {dispositivos.sala.tvOn ? `Desligar TV` : 'Ligar TV'}
                        </button>
                        <button onClick={ligarArCondicionado} style={{ width: '168px' }}>
                            {dispositivos.sala.arCondicionadoOn ? `Desligar Ar-Condicionado` : 'Ligar Ar-Condicionado'}
                        </button>
                    </div>
                    <div className='feedback'>
                        <div className='luzContainer'>
                            <img src='imgs\luz.png' className={`lampada status ${dispositivos.sala.luzOn ? 'on' : 'off'}`} />
                        </div>
                        <div className='tvContainer'>
                            <div className={`screen ${!dispositivos.sala.tvOn ? 'off' : 'on'}`} >
                                <div className="inner"></div>
                            </div>
                            {dispositivos.sala.tvOn && <button onClick={controlarTv} className='canal'>{`Trocar (Canal ${dispositivos.sala.canalAtual})`}</button>}
                        </div>
                        <div className='arContainer'>
                            <img src='imgs\ar.png' className={`ar status ${dispositivos.sala.arCondicionadoOn ? 'on' : 'off'}`} />
                            {dispositivos.sala.arCondicionadoOn && <button onClick={ajustarArCondicionado} className='temperatura'>{`Ajustar Ar (Temp: ${dispositivos.sala.temperatura}°C)`}</button>}
                        </div>
                    </div>
                </div>

                <div className='comodo'>
                    <h2>Cozinha</h2>
                    <div className="options">
                        <button onClick={acenderLuzCozinha} style={{ width: '91px' }}>
                            {dispositivos.cozinha.luzOn ? 'Desligar Luz' : 'Ligar Luz'}
                        </button>
                        <button onClick={ligarFogao} style={{ width: '107px' }}>
                            {dispositivos.cozinha.fogaoOn ? `Desligar Fogão` : 'Ligar Fogão'}
                        </button>
                    </div>
                    <div className='feedback'>
                        <div className='luzContainer'>
                            <img src='imgs\luz.png' className={`lampada status ${dispositivos.cozinha.luzOn ? 'on' : 'off'}`} />
                        </div>
                        <div className='geladeiraContainer'>
                            <img src='imgs\geladeira.png' className='geladeira' />
                            <p>Temperatura da Geladeira: {dispositivos.cozinha.geladeiraTemperatura}°C</p>
                            {dispositivos.cozinha.alertaGeladeira && <p className='alerta'>Alerta: Temperatura alta!</p>}
                        </div>
                        <div className='fogaoContainer'>
                            <div className={`fire potencia-${dispositivos.cozinha.fogaoPotencia} ${dispositivos.cozinha.fogaoOn ? 'on' : 'off'}`}>
                                <div className="fire-left">
                                    <div className="main-fire"></div>
                                    <div className="particle-fire"></div>
                                </div>
                                <div className="fire-center">
                                    <div className="main-fire"></div>
                                    <div className="particle-fire"></div>
                                </div>
                                <div className="fire-right">
                                    <div className="main-fire"></div>
                                    <div className="particle-fire"></div>
                                </div>
                                <div className="fire-bottom">
                                    <div className="main-fire"></div>
                                </div>
                            </div>
                            <img src='imgs\stove.png' className={`fogao status ${dispositivos.cozinha.fogaoOn ? 'on' : 'off'}`} />
                            {dispositivos.cozinha.fogaoOn && <button onClick={ajustarFogao} className='potencia'>{`(Potência: ${dispositivos.cozinha.fogaoPotencia})`}</button>}
                        </div>
                    </div>
                </div>

                <div className='comodo'>
                    <h2>Quarto</h2>
                    <div className="options">
                        <button onClick={acenderLuzQuarto} style={{ width: '91px' }}>
                            {dispositivos.quarto.luzOn ? 'Desligar Luz' : 'Ligar Luz'}
                        </button>
                        <button onClick={ligarVentilador} style={{ width: '128px' }}>
                            {dispositivos.quarto.ventiladorOn ? `Desligar Ventilador` : 'Ligar Ventilador'}
                        </button>
                        <button onClick={controlarCortinas} style={{ width: '111px' }}>
                            {dispositivos.quarto.cortinasAbertas ? 'Fechar Cortinas' : 'Abrir Cortinas'}
                        </button>
                    </div>
                    <div className='feedback'>
                        <div className='luzContainer'>
                            <img src='imgs\luz.png' className={`lampada status ${dispositivos.quarto.luzOn ? 'on' : 'off'}`} />
                        </div>
                        <div className="ventiladorContainer">
                            <div className={`fan velocidade-${dispositivos.quarto.ventiladorVelocidade} ${dispositivos.quarto.ventiladorOn ? 'on' : 'off'}`}>
                                <div className="blade"></div>
                                <div className="blade"></div>
                                <div className="blade"></div>
                            </div>
                            {dispositivos.quarto.ventiladorOn && <button onClick={ajustarVentilador} className='velocidade'>{`(Velocidade: ${dispositivos.quarto.ventiladorVelocidade})`}</button>}
                        </div>
                        <div className="cortinasContainer">
                            <div className="rxWorld">

                                <section className={`rnOuter ${dispositivos.quarto.cortinasAbertas ? 'open' : 'closed'}`}>
                                    
                                <section className="aoTable">
                                    <div className="aoTableCell">
                                        <div className="window"></div>
                                        <div className="window"></div>
                                        <div className="window"></div>
                                        <div className="window"></div>
                                    </div>
                                </section>
                                    
                                    <div className='rnInner'>
                                        <div className='rnUnit'></div>
                                        <div className='rnUnit'></div>
                                        <div className='rnUnit'></div>
                                        <div className='rnUnit'></div>
                                        <div className='rnUnit'></div>
                                        <div className='rnUnit'></div>
                                        <div className='rnUnit'></div>
                                        <div className='rnUnit'></div>
                                        <div className='rnUnit'></div>
                                        <div className='rnUnit'></div>
                                        
                                    </div>
                                </section>
        
        
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ 'marginTop': '55px'}}>
                <img src="imgs/smart-home.png"  style={{ 'height': '230px'}} alt="Smart Home Logo" />
            </div>

            <div className="github-repo">
                <a href="https://github.com/lucaszambam/smart-home" target="_blank">
                    <img src="imgs/github-mark-white.svg" alt="GitHub Repository" />
                </a>
	</div>
        </div>
    );
};

export default App;
