        var app = new Vue({
            el: '#app',
            data: () => ({
                dialog: false,
                drawer: true,
                windowSize: {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0
                },
                Colorerror: 'info',
                metodo: '',
                funDeXs: '',
                menu: '',
                Xi: '',
                Xf: '',
                deriF: '',
                Xn: '',
                eR: '',
                evaluacion: [],
                headersBise: [{
                        text: '#',
                        align: 'left',
                        sortable: false,
                        value: 'numero'
                    },
                    {
                        text: 'Xi',
                        sortable: false,
                        value: 'Xi'
                    },
                    {
                        text: 'Xf',
                        sortable: false,
                        value: 'Xf'
                    },
                    {
                        text: 'Xm',
                        sortable: false,
                        value: 'Xm'
                    },
                    {
                        text: 'f(Xi)',
                        sortable: false,
                        value: 'fXi'
                    },
                    {
                        text: 'f(Xm)',
                        sortable: false,
                        value: 'fXm'
                    },
                    {
                        text: 'f(Xi)*f(Xm)',
                        sortable: false,
                        value: 'fXifXm'
                    },
                    {
                        text: 'Ea',
                        sortable: false,
                        value: 'Ea'
                    }
                ],
                headersNewton: [{
                        text: '#',
                        align: 'left',
                        sortable: false,
                        value: 'numero'
                    },
                    {
                        text: 'X',
                        sortable: false,
                        value: 'X'
                    },
                    {
                        text: 'f(X)',
                        sortable: false,
                        value: 'fX'
                    },
                    {
                        text: 'f´(X)',
                        sortable: false,
                        value: 'fderiX'
                    },
                    {
                        text: 'Ea',
                        sortable: false,
                        value: 'Ea'
                    }
                ],
                headersSecante: [{
                        text: '#',
                        align: 'left',
                        sortable: false,
                        value: 'numero'
                    },
                    {
                        text: 'Xn-1',
                        sortable: false,
                        value: 'Xa'
                    },
                    {
                        text: 'Xn',
                        sortable: false,
                        value: 'Xb'
                    },
                    {
                        text: 'f(Xn-1)',
                        sortable: false,
                        value: 'fXa'
                    },
                    {
                        text: 'f(Xn)',
                        sortable: false,
                        value: 'fXb'
                    },
                    {
                        text: 'Xn+1',
                        sortable: false,
                        value: 'Xc'
                    },
                    {
                        text: 'Ea',
                        sortable: false,
                        value: 'Ea'
                    }
                ],

            }),
            watch: {
                menu: function () {
                    this.limpiar()
                    switch (this.menu) {
                        case 'biseccion':
                            this.metodo = 'Bisección'
                            this.funDeXs = '4X^2 -5x'
                            this.Xi = '1'
                            this.Xf = '1.6'
                            break
                        case 'newton':
                            this.metodo = 'Newton'
                            this.funDeXs = '2x^3 + e^x + 4'
                            this.deriF = '6x^2 + e^x'
                            this.Xn = '3'
                            break
                        case 'secante':
                            this.metodo = 'Secante'
                            this.funDeXs = 'e^-x - x'
                            this.Xi = '0'
                            this.Xf = '1'
                            break
                        default:
                            break;
                    }
                },
                dialog: function () {
                    this.grafica()
                }
            },
            methods: {
                biseccion() {
                    this.evaluacion = []
                    var cont = 1
                    let a, b, m, fXi, fXf, fXm, FxifXm, eR, Xr
                    this.eR = 80
                    this.Xr = ''
                    this.a = this.Xi
                    this.b = this.Xf
                    if (this.evaluarFun(this.funDeXs, this.a) * this.evaluarFun(this.funDeXs, this.b) < 0) {
                        while (this.eR > 0.01) {
                            this.m = this.puntoMedio()
                            this.fXi = this.evaluarFun(this.funDeXs, this.a)
                            this.fXm = this.evaluarFun(this.funDeXs, this.m)

                            this.fXifXm = this.evaluarXiXn()

                            if (this.fXifXm.toString() == 'NaN') {
                                this.evaluacion = []
                                this.Colorerror = 'error'
                                return
                            }

                            if (this.fXifXm > 0) {
                                this.Xr = 'a'
                                this.eR = this.errAbsoluto(this.m, this.a)
                            } else {
                                this.Xr = 'b'
                                this.eR = this.errAbsoluto(this.m, this.b)
                                this.eR = this.eR.toString().replace('-', '')
                            }

                            this.evaluacion.push({
                                numero: cont,
                                Xi: this.a,
                                Xf: this.b,
                                Xm: this.m,
                                fXi: this.funDeXs.toLowerCase().split('x').join('(' + this.a + ')') +
                                    '= ' +
                                    this.fXi,
                                fXm: this.funDeXs.toLowerCase().split('x').join('(' + this.m + ')') +
                                    '= ' +
                                    this.fXm,
                                fXifXm: '(' + this.fXi + ')*(' + this.fXm + ')= ' + this.fXifXm,
                                Ea: this.eR + '%'
                            })

                            this.Xr == 'a' ? this.a = this.m : this.b = this.m
                            cont++
                        }
                        // alert('El resultado fue: ' + this.m + '\ninteracciones: ' + cont)
                    } else {
                        this.evaluacion = []
                        this.Colorerror = 'error'
                        return
                    }
                },
                newton() {
                    this.evaluacion = []
                    this.eR = 100
                    var cont = 0
                    let ant = 0
                    let nuevo = this.Xn
                    let x, funX, deriX, verificar
                    while (this.eR > 0.01) {
                        x = nuevo
                        this.funX = this.evaluarFun(this.funDeXs, x)
                        this.deriX = this.evaluarFun(this.deriF, x)
                        this.eR = this.errAbsoluto(nuevo, ant)

                        verificar = this.funX * this.deriX * x
                        if (verificar.toString() == 'NaN') {
                            this.evaluacion = []
                            this.Colorerror = 'error'
                            return
                        }


                        this.evaluacion.push({
                            numero: 'X' + cont,
                            X: x,
                            fX: this.funDeXs.toLowerCase().split('x').join('(' + x + ')') + '= ' +
                                this.funX,
                            fderiX: this.deriF.toLowerCase().split('x').join('(' + x + ')') + '= ' +
                                this.deriX,
                            Ea: this.eR + '%'
                        })

                        ant = x
                        nuevo = math.eval(x - (this.funX / this.deriX))

                        cont++
                    }
                },
                secante() {
                    this.evaluacion = []
                    this.eR = 100
                    var cont = 0
                    let ant = this.Xi
                    let X = this.Xf
                    let nuevo, funX, funAnt, funXc, srtXc, verificar
                    funXc = 'X1 - F(X1)*((X1 - X0)/(F(X1) - F(X0)))'
                    while (this.eR > 0.01) {
                        funX = this.evaluarFun(this.funDeXs, X)
                        funAnt = this.evaluarFun(this.funDeXs, ant)
                        srtXc = funXc
                            .split('F(X1)').join('(' + funX + ')')
                            .split('F(X0)').join('(' + funAnt + ')')
                            .split('X1').join('(' + X + ')')
                            .split('X0').join('(' + ant + ')')
                        nuevo = math.eval(srtXc)

                        this.eR = this.errAbsoluto(nuevo, X)
                        verificar = funX * funAnt * X * nuevo * ant
                        if (verificar.toString() == 'NaN') {
                            this.evaluacion = []
                            this.Colorerror = 'error'
                            return
                        }

                        this.evaluacion.push({
                            numero: 'X' + cont,
                            Xa: ant,
                            Xb: X,
                            fXa: this.funDeXs.toLowerCase().split('x').join('(' + ant + ')') + '= ' +
                                funAnt,
                            fXb: this.funDeXs.toLowerCase().split('x').join('(' + X + ')') + '= ' +
                                funX,
                            Xc: srtXc + '= ' + nuevo,
                            Ea: this.eR + '%'
                        })

                        ant = X
                        X = nuevo

                        cont++
                    }
                },
                puntoMedio() {
                    try {
                        return (parseFloat(this.a) + parseFloat(this.b)) / 2
                    } catch {
                        this.evaluacion = []
                        this.Colorerror = 'error'
                    }

                },
                evaluarFun(funcion, valor) {
                    try {
                        return math.eval(funcion.toLowerCase().split('x').join('(' + valor + ')'))
                    } catch {
                        this.evaluacion = []
                        this.Colorerror = 'error'
                    }
                },
                evaluarXiXn() {
                    try {
                        return math.eval(this.fXi * this.fXm)
                    } catch {
                        this.evaluacion = []
                        this.Colorerror = 'error'
                    }
                },
                errAbsoluto(xNew, xOld) {
                    try {
                        return math.abs(((parseFloat(xNew) - parseFloat(xOld)) / parseFloat(xNew))) *
                            100
                    } catch {
                        this.evaluacion = []
                        this.Colorerror = 'error'
                    }
                },

                grafica() {
                    try {
                        // compile the expression once
                        var expression = this.funDeXs.toLowerCase()
                        var expr = math.compile(expression)

                        // evaluate the expression repeatedly for different values of x
                        var xValues = math.range(-10, 10, 0.1).toArray()
                        var yValues = xValues.map(function (x) {
                            return expr.eval({
                                x: x
                            })
                        })

                        // render the plot using plotly
                        var trace1 = {
                            x: xValues,
                            y: yValues,
                            type: 'scatter'
                        }
                        var data = [trace1]
                        var layout = {
                            // width: 690,
                            // height: 600
                            width: this.windowSize.x,
                            height: this.windowSize.y
                        }
                        Plotly.newPlot('plot', data, layout, {
                            responsive: true
                        })
                    } catch (err) {
                        console.error(err)
                        alert(err)
                    }

                },
                onResize() {
                    this.windowSize = {
                        x: 0.8 * window.innerWidth,
                        y: 0.8 * window.innerHeight
                    }
                    this.grafica()
                },

                limpiar() {
                    this.evaluacion = []
                    this.funDeXs = ''
                    this.Xi = ''
                    this.Xf = ''
                    this.deriF = ''
                    this.Xn = ''
                    this.eR = 100
                    this.Colorerror = 'info'
                    this.verGrafica = false
                }

            },
            props: {
                source: String
            }
        })

        window.onresize = function () {
            Plotly.relayout(plot, {
                width: this.windowSize.x,
                height: this.windowSize.y
            })
        }