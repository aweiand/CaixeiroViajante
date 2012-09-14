/* 
 * Um carteiro precisa entregar cartas em 6 cidades diferentes e de 
 * acordo com o seu chefe, ele deverá percorrer todas as cidades uma 
 * única vez e deverá voltar para a cidade de onde partiu, utilizando
 * a menor distância total percorrida.
 *
 *  Distâncias entre as cidades:
 *
 * A -> B = 5   B -> C = 4   C -> D = 2   D -> E = 3   E -> F = 4
 * A -> C = 8   B -> D = 6   C -> E = 6   D -> F = 6
 * A -> D = 7   B -> E = 7   C -> F = 7
 * A -> E = 6   B -> F = 9
 * A -> F = 4 
 *
 * Regra:
 *
 * O carteiro não pode percorrer cidades vizinhas.
 *
 *	-	-	0	1	2	3	4	5
 *	-	-	A	B	C	D	E	F
 *	0	A	*	5	8	7	6	4
 *	1	B	5	*	4	6	7	9
 *	2	C	8	4	*	2	6	7
 *	3	D	7	6	2	*	3	6
 *	4	E	6	7	6	3	*	4
 *	5	F	4	9	7	6	4	*
 *
 */

/**
 * Matriz Principal com todas as rotas e distâncias entre elas de 
 * acordo com a matriz acima
 */
var mat = [
	[0, 5, 8, 7, 6, 4],
	[5, 0, 4, 6, 7, 9],
	[8, 4, 0, 2, 6, 7],
	[7, 6, 2, 0, 3, 6],
	[6, 7, 6, 3, 0, 4],
	[4, 9, 7, 6, 4, 0]
		  ];

/**
 * Matriz secundária com todas as rotas já percorridas definidas por -1
 */
var matPerc = [
	[-1, 0, 0, 0, 0, 0],
	[0, -1, 0, 0, 0, 0],
	[0, 0, -1, 0, 0, 0],
	[0, 0, 0, -1, 0, 0],
	[0, 0, 0, 0, -1, 0],
	[0, 0, 0, 0, 0, -1]
		  ];

//Total Caminhado pelo usuario
var caminho = 0;

//Total Caminhado pelo Bot
var mCamin  = 0;

/**
 * Função utilizada para traduzir a letra passada
 * no parâmentro em número a ser utilizado nas funcções
 * @param UPPER String i - Letra
 * @access public
 * @return Interger
 */
function traduzLetra(i){
	switch(i){
	case 'A' : i=0; 
		break;
	case 'B' : i=1; 
		break;
	case 'C' : i=2; 
		break;
	case 'D' : i=3; 
		break;
	case 'E' : i=4; 
		break;
	case 'F' : i=5; 
		break;
	};
	return i;
}

/**
 * Função utilizada para adicionar valor caminhado pelo usuario
 * na variavel global
 * @param Integer i - Posição
 * @param Integer j - Posição
 * @access public
 * @return Null
 */
function setCaminhoInd(i,j){
	i = traduzLetra(i);
	j = traduzLetra(j);
	caminho += mat[i][j];
}

/**
 * Função utilizada para setar a matriz secundaria como percorrida
 * nas varíaves passadas
 * @param Integer i - Posição
 * @param Integer j - Posição
 * @param Boolean set
 * @access public
 * @return boolean
 */
function setPerc(i,j, set){
	i = traduzLetra(i);
	j = traduzLetra(j);
	if (mat[i][j] == -1)
		return false;
	else {
		if (set){
			matPerc[i][j] = -1;
		}
		return true;
	}
}

/**
 * Função utilizada para saber se a matriz secundária
 * já foi toda percorrida
 * @access public
 * @return boolean
 */
function getPerc(){
	var i,j, r;
	r = false;
	for(i=0;i<matPerc.length;i++){
		for(j=0;j<matPerc.length;j++){
			if (matPerc[i][j] != 0)
				r = true;
		}
	}
	return r;
}

/**
 * Função utilizada para saber se as variáveis são vizinhas
 * e se for a última jojgada também permite setar as vizinhas
 * @param Integer a - Posição
 * @param Integer b - Posição
 * @access public
 * @return boolean
 */
function eVizinha(a, b){
	a = traduzLetra(a);
	b = traduzLetra(b);

	var qual = 0;
	$("#city1 :radio").each(function(){
		if ($(this).is(":disabled"))
			qual = qual + 1;
	});
	
	if (qual == (mat.length-1))
		return false;
	else if ((a-1) == b)
		return true;
	else if ((a+1) == b)
		return true;
	else if (a == 0 && b == (mat.length-1))
		return true;
	else if (b == 0 && a == (mat.length-1))
		return true;
	else
		return false;
}

/**
 * Função utilizada para capturar a ciadde marcada nos radiobuttons
 * de acordo com o lado informado se cidade 1 ou 2
 * @param Integer city - cidade
 * @access public
 * @return Integer
 */
function checkMarcado(city){
	var qual;
	$("#city"+city+" :radio").each(function(){
		if ($(this).is(":checked"))
			qual = $(this).attr("id");
	});
	return qual;
}

/**
 * Função de IA, utilizada para fazer o caminho mais curto dando como
 * partida uma cidade inicial na city1, e passando por todas as cidades
 * sem passar nas vizinhas e sem repetir cidades, retornando para a cidades
 * inicial
 * @param Integer citis - ID da cidade
 * @access public
 * @return boolean
 */
function caixeiro(citis){
	var citi = citis;
	var i,k;
	var anter = citis;
	var aux;
	var ulti = 0;

	while(getPerc()){
		aux = 99999999;
		for (i=0;i<mat.length;i++){
			if ( (mat[citi][i] < aux) && (setPerc(citi,i, false)) && (mat[citi][i] != 0) && (i != anter) ){
				if ( ulti == mat.length-1 ){
					aux = mat[citi][citis];
					k = citis;
				} else				
				if ( ulti != mat.length && (!eVizinha(citi,i)) ){
					aux = mat[citi][i];
					k = i;
				};
			};					
		};
		//console.log("Estou em "+citi+" mais curto eh "+k+" distancia "+aux);
		setPerc(citi,k, true);
		mCamin += aux;
		escrevePerc(citi,k,mCamin);
		anter = citi;
		citi = k;
		ulti++;
		if (ulti == mat.length)
			break;
	};
	//console.log("Total "+mCamin);
	return true;
}

/**
 * Função utilizada para traduzir o número passado
 * no parâmentro em letra a ser utilizado nas funcções
 * @param Integer i - Número a ser traduzido
 * @access public
 * @return String
 */
function traduzNumero(i){
	var l = '';
	switch(i){
	case 0 : l='A'; 
		break;
	case 1 : l='B'; 
		break;
	case 2 : l='C'; 
		break;
	case 3 : l='D'; 
		break;
	case 4 : l='E'; 
		break;
	case 5 : l='F'; 
		break;
	};
	return l;
}

/**
 * Função utilizada escrever as cidades percorridas pelo IA
 * para realizar o percurso
 * @param Integer i - Posição
 * @param Integer j - Posição
 * @param Integer parc - soma do percurso até este ponto
 * @access public
 * @return Null
 */
function escrevePerc(i,j,parc){
	$("#pontosAut").append('<li>Estou em '+traduzNumero(i)+' mais curto é '+traduzNumero(j)+' distancia '+parc+'</li>');
}

