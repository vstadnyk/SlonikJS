<? 
if (empty($_POST)) die;

//підключаємо joomla framework
define('_JEXEC',1);
define('JPATH_BASE',getenv("DOCUMENT_ROOT"));
define('DS',DIRECTORY_SEPARATOR);
require_once(JPATH_BASE .DS.'includes'.DS.'defines.php');
require_once(JPATH_BASE .DS.'includes'.DS.'framework.php');
require_once(JPATH_BASE .DS.'libraries'.DS.'joomla'.DS.'factory.php');

//отримуємо доступ до configuration.php
$config = JFactory::getConfig();

$HTTP_HOST = parse_url("http://".$_SERVER["HTTP_HOST"]); 
$HTTP_HOST = str_replace(array("http://","www."),"",$HTTP_HOST["host"]);

$posts = $_POST;
$responce = array();
$error = array();


foreach ($posts as $post) {
	if (!strlen($post['value']) && $post['required'] == 'true') {
		$error[] = $post['name'];
	}
}

if (!empty($error)) {
	$responce['send'] = false;
	$responce['text'] = '{%error_empty_data%}';
	$responce['fields'] = $error;
} else {
	
	$from = $config->get('sitename').' <noreply@'.$HTTP_HOST.'>';
	$to = $config->get('mailfrom');

	$subject = 'Сообщение с сайта '.$config->get('sitename');
	$message = '<table style="border-collapse: collapse;" border="1"><tbody>';
	$message .= table_row('type', $posts['type']);
	$message .= table_row('date', date('d.m.Y H:i:s'));

	foreach ($posts as $post) {
		$message .= table_row($post['name'], $post['value']);
	}

	$message .= '</tbody></table>';

		
	$headers = 'MIME-Version: 1.0'."\r\n";
	$headers .= 'Content-type: text/html; charset=utf-8'."\r\n";
	$headers .= 'From: '.$from."\r\n";

	if (mail($to, $subject, $message, $headers)){
		$responce['send'] = true;
		$responce['text'] = '{%success_send_data%}';
	}

}

echo json_encode($responce);

function table_row ($label, $value) {
	$lang = array(
		'type' => 'Тип сообщения',
		'date' => 'Время отправки',
		'name' => 'Имя отправителя',
		'email' => 'email',
		'phone' => 'Номер телефона',
		'address' => 'Адрес',
		'message' => 'Текст сообщения',
	);
	
	if (!isset($lang[$label])) {
		return '';
	} else {	
		return '<tr>
					<td style="padding: 5px; background: #bbb;">
						<b>'.$lang[$label].':</b>
					</td>
					<td style="padding: 5px;">'.$value.'</td>
				</tr>';
	}
}
?>