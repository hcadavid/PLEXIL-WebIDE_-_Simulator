//1110000000000000 57344
MASKP1=57344;

//0001111111000000 8128
MASKP2=8128;

//0000000000111111 63
MASKP3=63;

p1=function(value){
    result=value;
    result = result & MASKP1;
    result = result >> 13;
    return result;
}

p2=function(value){
		result=value;
    result = result & MASKP2;
    result = result >> 6;
    return result;
}

p3=function(value){
    result=value;
    result = result & MASKP3;    
    return result;
}

encodeData=function(value,sensorId,out){
    //10000000
		out1=128;
           
    //   00000YYY
    out[0]=p1(value);

    //   SENSOR: 0000XXXX
    //               <---
    //           0XXXX000
    //   00000YYY
    //      OR
    //   0XXXX000
    out[0]=out[0] | (sensorId<<3);
    out[0]=out[0] | out1;

    out2=0;
    out[1]=out2 | p2(value);

    
    //    00VVVVVV
    //     <---
    //    0VVVVVV0    
    out3=p3(value);
    out3 = out3 << 1;
    
    //    0VVVVVC
    //    C=parity(value)
    checkcode=parity1(value);
        
    out[2]= out3 | checkcode;    
};



parity1=function(data)
{
    data ^= (data >> 1);
    data ^= (data >> 2);
    data ^= (data >> 4);
    data ^= (data >> 8);
    data ^= (data >> 16);
    return (data & 0x1);
}
