package com.oy.clientdemo;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import java.io.IOException;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.internal.tls.OkHostnameVerifier;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    private Button conBtn,conBtn2;
    private TextView res_tv,res_tv2;
    public String url = "http://v3.wufazhuce.com:8000/api/hp/idlist/0?version=3.5.0&platform=android";
    public String url2 = "http://192.168.43.1:1884/dcu/getDevicesInfo/";
    public String url3 = "https://192.168.43.1:1883/dcu/addDevice/";
    public String newDev ="{\"deviceID\":\"115\",\"token\":\"001125\",\"status\":\"2\"}";
//    public String url4 = "http://192.168.0.107:1883/lss";
    public static final MediaType JSON = MediaType.parse("application/json");
    OkHttpClient okHttpClient = new OkHttpClient();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //---------GET-------
        conBtn = (Button) findViewById(R.id.conBtn);
        conBtn.setOnClickListener(this);
        res_tv = (TextView) findViewById(R.id.res_tv);
        //------------POST-------
        conBtn2 = (Button) findViewById(R.id.conBtn2);
        conBtn2.setOnClickListener(this);
        res_tv2 = (TextView) findViewById(R.id.res_tv2);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.conBtn:

                Request request = new Request.Builder()
                        .url(url2)
                        .build();
                Call call = okHttpClient.newCall(request);
                call.enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        Log.d("msg", "onFailure: ");
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                Toast.makeText(getApplicationContext(),
                                        "sorry----go die",Toast.LENGTH_SHORT).show();
                            }
                        });

                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        final String str = response.body().string();
                        Log.d("msg", "onResponse: "+str);
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {

                                res_tv.setText(str);
                            }
                        });

                    }
                });
                break;
            case R.id.conBtn2:

                X509TrustManager xtm = new X509TrustManager() {
                    @Override
                    public void checkClientTrusted(X509Certificate[] chain, String authType) {
                    }

                    @Override
                    public void checkServerTrusted(X509Certificate[] chain, String authType) {
                    }

                    @Override
                    public X509Certificate[] getAcceptedIssuers() {
                        X509Certificate[] x509Certificates = new X509Certificate[0];
                        return x509Certificates;
                    }
                };

                SSLContext sslContext = null;
                try {
                    sslContext = SSLContext.getInstance("SSL");

                    sslContext.init(null, new TrustManager[]{xtm}, new SecureRandom());

                } catch (NoSuchAlgorithmException e) {
                    e.printStackTrace();
                } catch (KeyManagementException e) {
                    e.printStackTrace();
                }
                HostnameVerifier DO_NOT_VERIFY = new HostnameVerifier() {
                    @Override
                    public boolean verify(String hostname, SSLSession session) {
                        return true;
                    }
                };
                OkHttpClient okHttpClient2 = new OkHttpClient.Builder()
                        .sslSocketFactory(sslContext.getSocketFactory())
                        .hostnameVerifier(DO_NOT_VERIFY)
                        .build();
                //POST提交Json数据
                RequestBody requestBody = RequestBody.create(JSON,newDev);

                Log.d("msg", "body---"+ requestBody.contentType());
                Request request2 = new Request.Builder()
                        .url(url3)

                        .post(requestBody)
                        .build();
                Call call1 = okHttpClient2.newCall(request2);
                try {
                    long length = RequestBody.create(JSON,newDev).contentLength();
                    Log.d("msg", "onClick: "+length);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                call1.enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        Log.d("msg", "onFailure: "+e.toString());
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {
                        final String str = response.body().string();
                        Log.d("msg", "onResponse: "+str);
                        runOnUiThread(new Runnable() {
                            @Override
                            public void run() {

                                res_tv2.setText(str);
                            }
                        });
                    }
                });
                break;
        }

    }
}
