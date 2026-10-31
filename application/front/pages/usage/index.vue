<template>
  <v-row density="compact">
    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title class="text-wrap">
          <v-icon>mdi-clover</v-icon>
          このアプリについて
        </v-card-title>
        <v-card-text>
          <div>
            多くの人に福井県の力のある企業を知ってもらい、地域活性化を目指しているアプリです。
          </div>
          <div>
            このアプリでは、「力のある企業」=「何らかの分野でNo.1である企業」としています。
          </div>
          <div>
            福井県のNo.1企業を知ったり、自分の知っているNo.1企業を共有したりして、より多くの人に福井県の企業へ興味を持ってもらえることを願っています。
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title class="text-wrap">
          <v-icon>mdi-web</v-icon>
          推奨環境（ブラウザ・OS）
        </v-card-title>
        <v-card-text>
          <div>
            Google Chrome（動作確認済みバージョン：101.0.4951.54、
            動作確認済みOS：Windows・iOS）
          </div>
          <div>
            Edge Chromium（動作確認済みバージョン：101.0.1210.47、
            動作確認済みOS：Windows）
          </div>
          <div>Safari（動作確認済みバージョン：15.4、動作確認済みOS：iOS）</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title class="text-wrap">
          <v-icon>mdi-google</v-icon>
          ログイン
        </v-card-title>
        <v-card-text>
          <div>Googleアカウントでログインできます。</div>
          <div>
            ログインすると、「新規投稿」「投稿のお気に入り登録」などができます。
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title class="text-wrap">
          <v-icon>mdi-plus</v-icon>
          新規投稿
        </v-card-title>
        <v-card-text>
          <div>
            ログイン後、画面右下の＋ボタンから新規投稿画面を開けます。スマホでは下部メニューの上に表示されます。
          </div>
          <div>企業検索では福井県の企業を選択できます。</div>
          <div>
            ※自分の投稿がすでにある企業は選択できません。他の人が投稿している企業は選択できます。
          </div>
          <div>
            「No.1の内容」には、何の分野でNo.1かを入力します。複数入力することもできます（例：「眼鏡生産台数」「眼鏡売上高」）。
          </div>
          <v-row>
            <v-col sm="6" cols="12">
              <v-img max-height="400" src="/usageNewPost.png" />
            </v-col>
            <v-col sm="6" cols="12">
              <v-img max-height="400" src="/usagePostInput.png" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title class="text-wrap">
          <v-icon>mdi-text-search</v-icon>
          投稿閲覧
        </v-card-title>
        <v-card-text>
          <div>
            「ホーム」には、このアプリに登録された投稿が表示されます。ログインしていなくても閲覧できます。
          </div>
          <div>
            企業のホームページURLが登録されている投稿では、企業名をクリックするとホームページを開けます。
          </div>
          <div>
            スーパーリロード（例：WindowsのGoogle
            Chromeでは、Ctrlキーを押しながら再読み込み）で画面を更新すると、ログインしていない状態の投稿内容が表示されます。スーパーリロードではなく、通常の再読み込みで更新してください。
          </div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title class="text-wrap">
          <v-icon>mdi-alert</v-icon>
          通報
        </v-card-title>
        <v-card-text>
          <div>
            他の人の投稿に誤りがある場合は、通報アイコンから通報できます。
          </div>
          <div>通報された投稿は、すべてのユーザーに表示されなくなります。</div>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col :cols="columnSpan">
      <v-card>
        <v-card-title class="text-wrap">
          <v-icon>mdi-check</v-icon>
          利用規約
        </v-card-title>
        <v-card-text>
          <div>
            本アプリでの投稿内容・通報内容に起因した直接的または間接的なトラブルについては、本アプリ運営者側では責任を負いません。
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useHead } from '#app';

const columnSpan = '12';
useHead({ title: '使い方' });
</script>
