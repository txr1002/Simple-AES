#include <bits/stdc++.h>
using namespace std;

int temp[16];
int text[16];
int code[16];
int cnt = 0;

int ke[32];
int key1[16];
int key11[16];

int key2[16];
int key3[16];
int t[4];
int tp[4];
int tt[16]={0,4,8,12,3,7,11,15,6,2,14,10,5,1,13,9};
int ttt[16] = {0,2,4,6,8,10,12,14,3,1,7,5,11,9,15,13};
int tttt[16] = {0,9,1,8,2,11,3,10,4,13,5,12,6,15,7,14};

int r1[8]={1,0,0,0,0,0,0,0};
int r2[8]={0,0,1,1,0,0,0,0};
int s[4][4]={
    {9,4,10,11},
    {13,1,8,5},
    {6,2,0,3},
    {12,14,15,7}
};
int s_1[4][4] ={
    {10,5,9,11},
    {1,7,8,15},
    {6,0,2,3},
    {12,4,13,14}
};

void yihuo16 (int a[16],int b[16])
{
    for (int i = 0;i<16;i++)
    {
        if(a[i] != b[i])
            a[i] = 1;
        else
            a[i] = 0;
    }
}
    
//密钥扩展
void key_ex1(int k[16])
{
    //输入w0和w1
    int x = 2*k[12]+k[13];
    int y = 2*k[14]+k[15];
    int tep1 = s[x][y];
    x = 2*k[8]+k[9];
    y = 2*k[10]+k[11];
    int tep2 = s[x][y];
    for(int i =0;i<4;i++)
    {
        x=tep1%2;
        y=tep2%2;
        tep1/=2;
        tep2/=2;
        temp[3-i] = x;
        temp[7-i] = y;
    }

    for(int i = 0;i<8;i++)//不同出1，相同出0,0的范围更小
    {
        if(temp[i]==r1[i])
            key2[i] = 0;
        else
            key2[i] = 1;
    }
        for(int i = 0;i<8;i++)//不同出1，相同出0,0的范围更小
    {
        if(key2[i]==k[i])
            key2[i] = 0;
        else
            key2[i] = 1;
    }
        for(int i = 0;i<8;i++)//不同出1，相同出0,0的范围更小
    {
        if(key2[i]== k[i+8])//w2与w1异或
            key2[i+8] = 0;
        else
            key2[i+8] = 1;
    }
}
void key_ex2(int k[16])
{
    //输入w0和w1
    int x = 2*k[12]+k[13];
    int y = 2*k[14]+k[15];
    int tep1 = s[x][y];
    x = 2*k[8]+k[9];
    y = 2*k[10]+k[11];
    int tep2 = s[x][y];
    for(int i =0;i<4;i++)
    {
        x=tep1%2;
        y=tep2%2;
        tep1/=2;
        tep2/=2;
        temp[3-i] = x;
        temp[7-i] = y;
    }
    for(int i = 0;i<8;i++){
        if(temp[i]==r2[i])
            key3[i] = 0;
        else
            key3[i] = 1;
    }
    for(int i = 0;i<8;i++)
    {
        if(key3[i]==k[i])
            key3[i] = 0;
        else
            key3[i] = 1;
    }
        for(int i = 0;i<8;i++)
    {
        if(key3[i]== k[i+8])
            key3[i+8] = 0;
        else
            key3[i+8] = 1;
    }
}
void weiyi (int a[16])
{
    for(int i = 8;i<12;i++)
    {
        t[i-8] = a[i];
        a[i] = a[i+4];
        a[i+4] = t[i-8];
    }
}
void ban16(int tet[16])
{
    for (int i = 0;i<15;i+=4)
    {
        int x = tet[i]*2+tet[i+1];
        int y = tet[i+2]*2+tet[i+3];
        int tep1 = s[x][y];
        for (int j = 0;j<4;j++)
        {
            tet[i+3-j] = tep1%2;
            tep1/=2;
        }
    }
}

void shuchu(int a[16])
{
    int p = 0;
    string s = "abcd";
    for(int i = 0;i<16;i++)
    {
        p=p*2+a[i];
        if((i+1)%4 == 0)
        {
            if(p>9)
                s[(i+1)/4-1] = (char) p+87;
            else
                s[(i+1)/4-1] = (char) p+48;
            p=0;
        }
    }
    cout<<s<<endl;
}
void shuchu4(int a[4])
{
    int p = 0;
    string s = "abcd";
    for(int i = 0;i<4;i++)
    {
        p=p*2+a[i];
        if((i+1)%4 == 0)
        {
            if(p>9)
                s[(i+1)/4-1] = (char) p+87;
            else
                s[(i+1)/4-1] = (char) p+48;
            p=0;
        }
    }
    cout<<s[0]<<endl;
}
int turn4(int a[4])
{
    int p = 0;
    for(int i = 0;i<4;i++)
    {
        p=p*2+a[i];
        
    }
    return p;
}

int main()
{
    int n;
    bool flag;
    cin>>n;
    string te,cd;
    for(int e = 0;e<n;e++)
    {
        cin>>te;
        for(int i = 0;i<16;i++)
        {
            text[i] = (int) te[i] -48;
        }
        cin>>cd;
        for(int i = 0;i<16;i++)
        {
            code[i] = (int) cd[i] -48;
        }
        cout<<endl<<"The found key is as follows:"<<endl;
	    for (int p = 0;p<65536;p++)
	    {
	        for (int m = 0;m<65536;m++)
	        {
	            int pp = p;
	            int mm = m;
	            for(int i = 0;i<16;i++)
	            {
	                ke[15-i] = pp%2;
	                key1[15-i] = pp%2;
	                pp/=2;
	            }
	            //前半段密钥
	            for(int i = 0;i<16;i++)
	            {
	                ke[31-i] = mm%2;
	                key11[15-i] = mm%2;
	                mm/=2;
	            }//后半段密钥
	
	            //****************前半段加密后半段解密
	            key_ex1(key1);
	            key_ex2(key2);//初始化
	        
	            //第一轮
	            //轮密钥加
	            yihuo16(text , key1);
	        
	            //半字节替换
	            ban16(text);
	        
	            //行位移
	            weiyi(text);
	        
	        
	            //列混淆
	            for(int i = 0;i<16;i++)
	            {
	                temp[i] = text[i];
	            }
	            for (int i = 0;i<15;i+=4)
	            {
	                for(int j=0;j<4;j++)
	                {
	                    if(i>7)
	                        t[j] = temp[i-8+j];
	                    else
	                        t[j] = temp[i+8+j];
	                }
	                int a = turn4(t);
	                int b = tt[a];
	                for(int j=0;j<4;j++)
	                {
	                    text[i+3-j] = b%2;
	                    b/=2;
	                }
	        
	                
	                for(int j =0;j<4;j++)
	                {
	                    text[i+j] = text[i+j]^temp[i+j];
	                }
	            }
	        
	            yihuo16(text , key2);
	            //第一轮结束，进入第二轮
	            ban16(text);
	            weiyi(text);
	            yihuo16(text,key3);
	
	            //************加密结束，开始解密
	
	            key_ex1(key11);
	            key_ex2(key2);//初始化
	        
	            //第一轮
	            //轮密钥加
	            yihuo16(code , key3);
	        
	            //行位移
	            weiyi(code);
	        
	            //半字节替换
	            ban16(code);
	        
	            yihuo16(code , key2);
	        
	            //列混淆
	            for(int i = 0;i<16;i++)
	            {
	                temp[i] = code[i];
	            }
	            for (int i = 0;i<15;i+=4)
	            {
	                for(int j=0;j<4;j++)
	                {
	                    if(i>7){
	                        tp[j] = temp[i+j];
	                        t[j] = temp[i-8+j];}
	                    else{
	                        tp[j] = temp[i+j];
	                        t[j] = temp[i+8+j];}
	                }
	                int a = turn4(t);
	                int a1 = turn4(tp);
	                int b = ttt[a];//和2的乘法
	                int b1 = tttt[a1];//和9的乘法
	                
	                for(int j=0;j<4;j++)
	                {
	                    code[i+3-j] = b%2;
	                    b/=2;
	                    t[3-j] = b1%2;
	                    b1/=2;
	                }
	        
	                
	                for(int j =0;j<4;j++)
	                {
	                    code[i+j] = code[i+j]^t[j];
	                }
	            }
	        
	        
	            //第一轮结束，进入第二轮
	            weiyi(code);
	            ban16(code);
	            yihuo16(code,key1);
	            
	            
	
	            flag = 1;
	            for(int i = 0;i<16;i++)
	            {
	                if(text[i] != code[i]) flag = 0;
	            }
	            if(flag == 1)
	            {
	                for(int i = 0;i<32;i++)
	                {
	                    cout<<ke[i];
	                }
	                cout<<endl;
	            cnt+=1;
	            }
	        }
	    }
        
    }
    cout<<cnt;
   
}
