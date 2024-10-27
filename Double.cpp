#include <bits/stdc++.h>
using namespace std;

int temp[16];
int text[16];
int ke[32];
int key1[16];
int key11[16];
int key2[16];
int key3[16];
int t[4];
int tt[16]={0,4,8,12,3,7,11,15,6,2,14,10,5,1,13,9};

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
	cout<<"Please enter a 16-digit plaintext and a 32-character key:"<<endl;
    string te;
    cin>>te;
    for(int i = 0;i<16;i++)
    {
        text[i] = (int) te[i] -48;
    }

    string key;
    cin>>key;
    for(int i = 0;i<32;i++)
    {
        if(i<16) key1[i] = (int) key[i] -48;
        else key11[i-16] = (int) key[i] -48;
    }
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
//**************双重加密*****************
    key_ex1(key11);
    key_ex2(key2);//初始化

    //第一轮
    //轮密钥加
    yihuo16(text , key11);

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
    cout<<"The encrypted ciphertext is:"<<endl;

    for(int i = 0;i<16;i++)
    {
        cout<<text[i];
    }
}
